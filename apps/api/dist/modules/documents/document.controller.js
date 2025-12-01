import { prisma } from "../../shared/db.js";
import { jsonToString, stringToJson } from "../../shared/json.js";
import fs from 'fs';
import path from 'path';
// Cambiar de unifiedAIProcessor a personalizedProcessor
import { personalizedProcessor } from "./personalizedProcessor.js";
import { DocumentType, DocumentStatus } from '@prisma/client'; // IMPORT AGREGADO
export const uploadDocument = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const { originalname, mimetype, size, filename } = req.file;
        const filePath = path.join(process.env.UPLOAD_PATH || './uploads', filename);
        // Check if the file exists on disk
        if (!fs.existsSync(filePath)) {
            return res.status(400).json({ error: 'Uploaded file not found' });
        }
        // Create document in database
        const document = await prisma.document.create({
            data: {
                filename: originalname,
                fileUrl: `/uploads/${filename}`,
                fileSize: size,
                fileType: mimetype,
                documentType: DocumentType.OTHER, // CORREGIDO: usar enum
                status: DocumentStatus.PENDING, // CORREGIDO: usar enum
                userId: req.user.userId,
                organizationId: req.user.organizationId,
            },
        });
        // Read file from disk for processing
        const fileBuffer = fs.readFileSync(filePath);
        // CAMBIAR: Procesamiento personalizado con preferencias del usuario
        processWithUserPreferences(document.id, fileBuffer, mimetype, originalname, req.user.userId);
        res.status(201).json({
            documentId: document.id,
            message: 'Document uploaded successfully. Personalized AI processing started.',
            status: 'PROCESSING'
        });
    }
    catch (error) {
        console.error('Upload document error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
async function processWithUserPreferences(documentId, fileBuffer, mimeType, filename, userId) {
    try {
        await prisma.document.update({
            where: { id: documentId },
            data: { status: DocumentStatus.PROCESSING }, // CORREGIDO
        });
        console.log(`Starting personalized processing for document: ${documentId}`);
        // Procesar con preferencias del usuario
        const result = await personalizedProcessor.processWithUserPreferences(fileBuffer, mimeType, filename, userId);
        console.log(`Processing completed for document: ${documentId}`, {
            documentType: result.documentType,
            confidence: result.confidence,
            engine: result.processingEngine,
            fieldsMatched: result.userFieldsMatched
        });
        // VALIDAR Y CONVERTIR documentType
        const documentTypeMap = {
            'invoice': DocumentType.INVOICE,
            'receipt': DocumentType.RECEIPT,
            'contract': DocumentType.CONTRACT,
            'contract_certification': DocumentType.CONTRACT_CERTIFICATION,
            'other': DocumentType.OTHER,
            'INVOICE': DocumentType.INVOICE,
            'RECEIPT': DocumentType.RECEIPT,
            'CONTRACT': DocumentType.CONTRACT,
            'CONTRACT_CERTIFICATION': DocumentType.CONTRACT_CERTIFICATION,
            'OTHER': DocumentType.OTHER,
        };
        const validDocumentType = documentTypeMap[result.documentType] || DocumentType.OTHER;
        // Update document status
        await prisma.document.update({
            where: { id: documentId },
            data: {
                status: DocumentStatus.COMPLETED, // CORREGIDO
                documentType: validDocumentType, // USAR VALOR VALIDADO
                processedAt: new Date(),
            },
        });
        // Create processing record
        await prisma.documentProcessing.create({
            data: {
                documentId: documentId,
                extractedData: jsonToString({
                    ...result.extractedData,
                    _metadata: {
                        userFieldsMatched: result.userFieldsMatched,
                        personalizedProcessing: true,
                        processingTimestamp: new Date().toISOString()
                    }
                }),
                confidence: result.confidence,
                processingEngine: result.processingEngine,
                startedAt: new Date(),
                completedAt: new Date(),
            },
        });
        console.log(`Document ${documentId} processed successfully with user preferences`);
    }
    catch (error) {
        console.error('Personalized processing error:', error);
        // MEJOR MANEJO DE ERRORES
        await prisma.document.update({
            where: { id: documentId },
            data: {
                status: DocumentStatus.FAILED, // CORREGIDO
                processedAt: new Date(),
            },
        });
        await prisma.documentProcessing.create({
            data: {
                documentId: documentId,
                error: error instanceof Error ? error.message : 'Unknown processing error',
                startedAt: new Date(),
                completedAt: new Date(),
            },
        });
        // Log detallado del error
        console.error(`Failed to process document ${documentId}:`, {
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
        });
    }
}
export const getDocuments = async (req, res) => {
    try {
        const { page = '1', limit = '10', type, status, search } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const where = {
            userId: req.user?.userId,
        };
        if (type && type !== 'all') {
            // Convertir string a enum value
            const typeUpper = type.toUpperCase();
            if (Object.values(DocumentType).includes(typeUpper)) {
                where.documentType = typeUpper;
            }
        }
        if (status && status !== 'all') {
            // Convertir string a enum value
            const statusUpper = status.toUpperCase();
            if (Object.values(DocumentStatus).includes(statusUpper)) {
                where.status = statusUpper;
            }
        }
        if (search) {
            where.filename = {
                contains: search,
                mode: 'insensitive'
            };
        }
        const [documents, total] = await Promise.all([
            prisma.document.findMany({
                where,
                skip,
                take: parseInt(limit),
                orderBy: { uploadedAt: 'desc' },
                include: {
                    processing: {
                        select: {
                            confidence: true,
                            completedAt: true,
                            processingEngine: true
                        }
                    }
                }
            }),
            prisma.document.count({ where })
        ]);
        const formattedDocuments = documents.map((doc) => ({
            id: doc.id,
            filename: doc.filename,
            type: doc.documentType.toLowerCase(),
            status: doc.status.toLowerCase(),
            uploadedAt: doc.uploadedAt.toISOString(),
            processedAt: doc.processedAt?.toISOString(),
            confidence: doc.processing?.confidence,
            processingEngine: doc.processing?.processingEngine,
        }));
        res.json({
            documents: formattedDocuments,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
        });
    }
    catch (error) {
        console.error('Get documents error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
export const getDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const document = await prisma.document.findFirst({
            where: {
                id,
                userId: req.user?.userId,
            },
            include: {
                processing: true,
            },
        });
        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }
        const extractedData = document.processing ?
            stringToJson(document.processing.extractedData) : null;
        res.json({
            document: {
                id: document.id,
                filename: document.filename,
                type: document.documentType.toLowerCase(),
                status: document.status.toLowerCase(),
                uploadedAt: document.uploadedAt.toISOString(),
                processedAt: document.processedAt?.toISOString(),
                confidence: document.processing?.confidence,
                processingEngine: document.processing?.processingEngine,
                extractedData,
                fileUrl: document.fileUrl,
                fileSize: document.fileSize,
                fileType: document.fileType,
            },
        });
    }
    catch (error) {
        console.error('Get document error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
export const getDocumentMetrics = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const [totalDocuments, completedDocuments, failedDocuments, documentsByType] = await Promise.all([
            prisma.document.count({ where: { userId } }),
            prisma.document.count({
                where: {
                    userId,
                    status: DocumentStatus.COMPLETED // CORREGIDO
                }
            }),
            prisma.document.count({
                where: {
                    userId,
                    status: DocumentStatus.FAILED // CORREGIDO
                }
            }),
            prisma.document.groupBy({
                by: ['documentType'],
                where: { userId },
                _count: {
                    id: true,
                },
            })
        ]);
        const successRate = totalDocuments > 0 ?
            Math.round((completedDocuments / totalDocuments) * 100) : 0;
        const timeSaved = completedDocuments * 5; // 5 minutes saved per document
        const stats = {
            totalDocuments,
            processedDocuments: completedDocuments,
            failedDocuments,
            timeSaved,
            successRate,
            documentsByType: documentsByType.map((item) => ({
                type: item.documentType.toLowerCase(),
                count: item._count.id,
            })),
        };
        res.json({ stats });
    }
    catch (error) {
        console.error('Get document metrics error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
export const getDocumentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const document = await prisma.document.findFirst({
            where: {
                id,
                userId: req.user?.userId,
            },
            select: {
                id: true,
                status: true,
                processedAt: true,
                processing: {
                    select: {
                        confidence: true,
                        completedAt: true,
                        error: true,
                    }
                }
            }
        });
        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }
        res.json({
            id: document.id,
            status: document.status.toLowerCase(),
            processedAt: document.processedAt?.toISOString(),
            confidence: document.processing?.confidence,
            error: document.processing?.error,
        });
    }
    catch (error) {
        console.error('Get document status error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

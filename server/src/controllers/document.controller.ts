// src/controllers/document.controller.ts
import { Response } from 'express';
import { prisma } from '../lib/db';
import { AuthRequest } from '../middleware/auth.middleware';
import { jsonToString, stringToJson } from '../utils/json';
import fs from 'fs';
import path from 'path';
// Cambiar de unifiedAIProcessor a personalizedProcessor
import { personalizedProcessor } from '../services/personalizedProcessor';

export const uploadDocument = async (req: AuthRequest, res: Response) => {
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
        documentType: 'OTHER',
        status: 'PENDING',
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
  } catch (error) {
    console.error('Upload document error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// REEMPLAZAR función processDocumentWithAI por processWithUserPreferences
async function processWithUserPreferences(documentId: string, fileBuffer: Buffer, mimeType: string, filename: string, userId: string) {
  try {
    await prisma.document.update({
      where: { id: documentId },
      data: { status: 'PROCESSING' },
    });

    // CAMBIAR: Procesar con preferencias del usuario
    const result = await personalizedProcessor.processWithUserPreferences(
      fileBuffer, mimeType, filename, userId
    );

    // Update document status
    await prisma.document.update({
      where: { id: documentId },
      data: {
        status: 'COMPLETED',
        documentType: result.documentType,
        processedAt: new Date(),
      },
    });

    // Create processing record - incluir campos personalizados
    await prisma.documentProcessing.create({
      data: {
        documentId: documentId,
        extractedData: jsonToString({
          ...result.extractedData,
          _metadata: {
            userFieldsMatched: result.userFieldsMatched,
            personalizedProcessing: true
          }
        }),
        confidence: result.confidence,
        processingEngine: result.processingEngine,
        startedAt: new Date(),
        completedAt: new Date(),
      },
    });

    console.log(`Document ${documentId} processed successfully with user preferences`);
  } catch (error) {
    console.error('Personalized processing error:', error);
    
    await prisma.document.update({
      where: { id: documentId },
      data: { 
        status: 'FAILED',
        processedAt: new Date(),
      },
    });

    await prisma.documentProcessing.create({
      data: {
        documentId: documentId,
        error: error instanceof Error ? error.message : 'Unknown error',
        startedAt: new Date(),
        completedAt: new Date(),
      },
    });
  }
}

// Las demás funciones (getDocuments, getDocument, getDocumentMetrics, getDocumentStatus) se mantienen igual
export const getDocuments = async (req: AuthRequest, res: Response) => {
  try {
    const { page = '1', limit = '10', type, status, search } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: any = {
      userId: req.user?.userId,
    };

    if (type && type !== 'all') {
      where.documentType = (type as string).toUpperCase();
    }

    if (status && status !== 'all') {
      where.status = (status as string).toUpperCase();
    }

    if (search) {
      where.filename = {
        contains: search as string,
        mode: 'insensitive'
      };
    }

    const [documents, total] = await Promise.all([
      prisma.document.findMany({
        where,
        skip,
        take: parseInt(limit as string),
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

    const formattedDocuments = documents.map(doc => ({
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
      page: parseInt(page as string),
      totalPages: Math.ceil(total / parseInt(limit as string)),
    });
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getDocument = async (req: AuthRequest, res: Response) => {
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
  } catch (error) {
    console.error('Get document error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getDocumentMetrics = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    const [
      totalDocuments,
      completedDocuments,
      failedDocuments,
      documentsByType
    ] = await Promise.all([
      prisma.document.count({ where: { userId } }),
      prisma.document.count({ 
        where: { 
          userId, 
          status: 'COMPLETED' 
        } 
      }),
      prisma.document.count({ 
        where: { 
          userId, 
          status: 'FAILED' 
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
      documentsByType: documentsByType.map(item => ({
        type: item.documentType.toLowerCase(),
        count: item._count.id,
      })),
    };

    res.json({ stats });
  } catch (error) {
    console.error('Get document metrics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getDocumentStatus = async (req: AuthRequest, res: Response) => {
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
  } catch (error) {
    console.error('Get document status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
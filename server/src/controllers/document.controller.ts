import { Response } from 'express';
import { prisma } from '../lib/db';
import { AuthRequest } from '../middleware/auth.middleware';
import { jsonToString, stringToJson } from '../utils/json';

export const uploadDocument = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // In a real implementation, this would come from multer
    const { originalname, mimetype, size, buffer } = req.body;
    
    // Create document in database
    const document = await prisma.document.create({
      data: {
        filename: originalname,
        fileUrl: `/uploads/${Date.now()}-${originalname}`, // Simulated path
        fileSize: size,
        fileType: mimetype,
        documentType: 'OTHER', // AI will classify later
        status: 'PENDING',
        userId: req.user.userId,
        organizationId: req.user.organizationId, // ← AHORA SÍ EXISTE
      },
    });

    // Simulate async processing
    setTimeout(async () => {
      try {
        // Simulate AI extracted data
        const extractedData = {
          invoiceNumber: Math.random().toString(36).substring(2, 10).toUpperCase(),
          date: new Date().toISOString().split('T')[0],
          vendor: 'Sample Vendor',
          amount: (Math.random() * 1000).toFixed(2),
          currency: 'USD',
          taxAmount: (Math.random() * 100).toFixed(2),
          total: (Math.random() * 1100).toFixed(2),
        };

        await prisma.document.update({
          where: { id: document.id },
          data: {
            status: 'COMPLETED',
            processedAt: new Date(),
          },
        });

        await prisma.documentProcessing.create({
          data: {
            documentId: document.id,
            extractedData: jsonToString(extractedData),
            confidence: 0.85 + Math.random() * 0.1, // 85-95% confidence
            startedAt: new Date(),
            completedAt: new Date(),
          },
        });

        console.log(`Document ${document.id} processed successfully`);
      } catch (error) {
        console.error('Processing error:', error);
        await prisma.document.update({
          where: { id: document.id },
          data: { status: 'FAILED' },
        });
      }
    }, 3000); // Process after 3 seconds

    res.status(201).json({
      documentId: document.id,
      message: 'Document uploaded successfully. Processing started.',
      status: 'PENDING'
    });
  } catch (error) {
    console.error('Upload document error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

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
              completedAt: true
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
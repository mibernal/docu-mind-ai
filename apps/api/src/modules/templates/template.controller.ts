import { Request, Response } from 'express';
import { prisma } from '../../shared/db.js';

export const createTemplate = async (req: Request, res: Response) => {
  try {
    const { name, description, fields, sampleData, category, isDefault } = req.body;
    const userId = (req as any).user?.userId;
    const organizationId = (req as any).user?.organizationId;

    if (!userId || !organizationId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const template = await prisma.extractionTemplate.create({
      data: {
        name,
        description,
        fields,
        sampleData,
        category: category || 'general',
        isDefault: isDefault || false,
        userId,
        organizationId,
      },
    });

    res.status(201).json(template);
  } catch (error) {
    console.error('Create template error:', error);
    res.status(500).json({ error: 'Failed to create template' });
  }
};

export const getTemplates = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const organizationId = (req as any).user?.organizationId;

    const templates = await prisma.extractionTemplate.findMany({
      where: {
        OR: [
          { userId },
          { organizationId, isDefault: true },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(templates);
  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({ error: 'Failed to get templates' });
  }
};

export const updateTemplate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const userId = (req as any).user?.userId;

    const template = await prisma.extractionTemplate.findFirst({
      where: { id, userId },
    });

    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    const updated = await prisma.extractionTemplate.update({
      where: { id },
      data: updates,
    });

    res.json(updated);
  } catch (error) {
    console.error('Update template error:', error);
    res.status(500).json({ error: 'Failed to update template' });
  }
};

export const deleteTemplate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.userId;

    const template = await prisma.extractionTemplate.findFirst({
      where: { id, userId },
    });

    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    await prisma.extractionTemplate.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Delete template error:', error);
    res.status(500).json({ error: 'Failed to delete template' });
  }
};
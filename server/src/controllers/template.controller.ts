import { Response } from 'express';
import { prisma } from '../lib/db';
import { AuthRequest } from '../middleware/auth.middleware';
import { jsonToString, stringToJson } from '../utils/json';

export const createTemplate = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, fields } = req.body;

    const template = await prisma.extractionTemplate.create({
      data: {
        name,
        description,
        fields: jsonToString(fields) || '{}',
        organizationId: req.user!.organizationId,
      },
    });

    res.status(201).json({
      template: {
        ...template,
        fields: stringToJson(template.fields),
      },
    });
  } catch (error) {
    console.error('Create template error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTemplates = async (req: AuthRequest, res: Response) => {
  try {
    const templates = await prisma.extractionTemplate.findMany({
      where: {
        organizationId: req.user!.organizationId,
      },
    });

    const formattedTemplates = templates.map(template => ({
      ...template,
      fields: stringToJson(template.fields),
    }));

    res.json({ templates: formattedTemplates });
  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateTemplate = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, fields } = req.body;

    const template = await prisma.extractionTemplate.update({
      where: {
        id,
        organizationId: req.user!.organizationId,
      },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(fields && { fields: jsonToString(fields) || '{}' }),
      },
    });

    res.json({
      template: {
        ...template,
        fields: stringToJson(template.fields),
      },
    });
  } catch (error) {
    console.error('Update template error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteTemplate = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.extractionTemplate.delete({
      where: {
        id,
        organizationId: req.user!.organizationId,
      },
    });

    res.json({ message: 'Template deleted successfully' });
  } catch (error) {
    console.error('Delete template error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
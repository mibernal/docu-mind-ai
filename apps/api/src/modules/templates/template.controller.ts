import { Response } from 'express';
import { prisma } from '../../shared/db';
import { AuthRequest } from '../../core/middleware/auth.middleware';
import { jsonToString, stringToJson } from '../../shared/json';
import type { ExtractionTemplate } from '@prisma/client';

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

    // Evitamos "implicit any" anotando el tipo
    const formattedTemplates = templates.map((template: ExtractionTemplate) => ({
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

    // Nota: si tu modelo prisma tiene "id" como PK, usa only `where: { id }`.
    // Si tienes un índice compuesto por (id, organizationId) y lo modelaste como unique,
    // la forma de where que usas está OK. Ajusta según tu schema.
    const template = await prisma.extractionTemplate.update({
      where: {
        id,
        // Si Prisma no acepta este objeto porque `where` requiere campos únicos,
        // cambia a: where: { id }
        organizationId: req.user!.organizationId,
      } as any,
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
      } as any,
    });

    res.json({ message: 'Template deleted successfully' });
  } catch (error) {
    console.error('Delete template error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

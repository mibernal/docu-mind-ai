// src/controllers/onboarding.controller.ts
import { Response } from 'express';
import { prisma } from '../lib/db';
import { AuthRequest } from '../middleware/auth.middleware';
import { jsonToString, stringToJson } from '../utils/json';
import { templateService } from '../services/templateService';

export const setUserPreferences = async (req: AuthRequest, res: Response) => {
  try {
    const { useCase, customFields, documentTypes } = req.body;

    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Validar que el caso de uso sea válido
    const validUseCases = ['CONTRACT_CERTIFICATION', 'INVOICE_PROCESSING', 'LEGAL_DOCUMENTS', 'CUSTOM'];
    if (!validUseCases.includes(useCase)) {
      return res.status(400).json({ error: 'Invalid use case' });
    }

    // Guardar preferencias del usuario
    const preferences = await prisma.userPreferences.upsert({
      where: { userId: req.user.userId },
      update: {
        useCase,
        customFields: customFields ? jsonToString(customFields) : null,
      },
      create: {
        userId: req.user.userId,
        useCase,
        customFields: customFields ? jsonToString(customFields) : null,
      },
    });

    // Crear template personalizado basado en la selección
    if (useCase === 'CUSTOM' && customFields) {
      await prisma.extractionTemplate.create({
        data: {
          name: 'Template Personalizado',
          description: 'Template creado basado en sus preferencias',
          fields: jsonToString({
            fields: customFields,
            metadata: { generatedFrom: 'onboarding' }
          }),
          userId: req.user.userId,
          organizationId: req.user.organizationId,
          isDefault: true,
          category: 'personalized'
        },
      });
    } else if (useCase !== 'CUSTOM') {
      // Crear template predefinido basado en el caso de uso
      await templateService.createUserTemplateFromPreferences(req.user.userId, useCase);
    }

    // Si hay campos personalizados, guardarlos en la tabla custom_fields
    if (customFields && customFields.length > 0) {
      for (const field of customFields) {
        await prisma.customField.upsert({
          where: {
            userId_name: {
              userId: req.user.userId,
              name: field.name
            }
          },
          update: {
            type: field.type,
            description: field.description,
          },
          create: {
            userId: req.user.userId,
            name: field.name,
            type: field.type,
            description: field.description,
          },
        });
      }
    }

    res.json({ 
      success: true,
      message: 'Preferencias guardadas exitosamente',
      preferences: {
        useCase: preferences.useCase,
        customFields: stringToJson(preferences.customFields)
      }
    });
  } catch (error) {
    console.error('Set preferences error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserPreferences = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const preferences = await prisma.userPreferences.findUnique({
      where: { userId: req.user.userId },
    });

    const customFields = await prisma.customField.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' }
    });

    // Obtener templates del usuario
    const userTemplates = await prisma.extractionTemplate.findMany({
      where: {
        OR: [
          { userId: req.user.userId },
          { userId: null, organizationId: req.user.organizationId } // Templates de sistema
        ]
      },
      orderBy: { isDefault: 'desc' }
    });

    const formattedTemplates = userTemplates.map(template => ({
      ...template,
      fields: stringToJson(template.fields)
    }));

    res.json({
      preferences: preferences ? {
        useCase: preferences.useCase,
        customFields: stringToJson(preferences.customFields)
      } : null,
      customFields,
      templates: formattedTemplates
    });
  } catch (error) {
    console.error('Get preferences error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateUserPreferences = async (req: AuthRequest, res: Response) => {
  try {
    const { useCase, customFields } = req.body;

    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const updatedPreferences = await prisma.userPreferences.update({
      where: { userId: req.user.userId },
      data: {
        useCase,
        customFields: customFields ? jsonToString(customFields) : null,
      },
    });

    res.json({
      success: true,
      message: 'Preferencias actualizadas exitosamente',
      preferences: {
        useCase: updatedPreferences.useCase,
        customFields: stringToJson(updatedPreferences.customFields)
      }
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPredefinedTemplates = async (req: AuthRequest, res: Response) => {
  try {
    const predefinedTemplates = {
      CONTRACT_CERTIFICATION: templateService.getPredefinedTemplate('CONTRACT_CERTIFICATION'),
      INVOICE_PROCESSING: templateService.getPredefinedTemplate('INVOICE_PROCESSING'),
      LEGAL_DOCUMENTS: templateService.getPredefinedTemplate('LEGAL_DOCUMENTS')
    };

    res.json({ predefinedTemplates });
  } catch (error) {
    console.error('Get predefined templates error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const addCustomField = async (req: AuthRequest, res: Response) => {
  try {
    const { name, type, description } = req.body;

    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const customField = await prisma.customField.create({
      data: {
        userId: req.user.userId,
        name,
        type,
        description,
      },
    });

    res.json({
      success: true,
      message: 'Campo personalizado agregado exitosamente',
      customField
    });
  } catch (error) {
    console.error('Add custom field error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteCustomField = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await prisma.customField.delete({
      where: {
        id,
        userId: req.user.userId // Asegurar que solo pueda eliminar sus propios campos
      },
    });

    res.json({
      success: true,
      message: 'Campo personalizado eliminado exitosamente'
    });
  } catch (error) {
    console.error('Delete custom field error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
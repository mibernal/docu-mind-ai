// server/src/utils/validation.ts
import { z } from 'zod';

/* ===========================
   AUTH SCHEMAS
=========================== */
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email address').optional(),
}).refine(data => data.name || data.email, {
  message: 'At least one field must be provided',
});


/* ===========================
   PERSONALIZATION SCHEMAS
=========================== */
export const onboardingSchema = z.object({
  useCase: z.enum([
    'CONTRACT_CERTIFICATION',
    'INVOICE_PROCESSING',
    'LEGAL_DOCUMENTS',
    'CUSTOM'
  ]),
  customFields: z.array(z.object({
    name: z.string().min(1, 'Field name is required'),
    type: z.enum(['text', 'number', 'date', 'currency', 'percentage', 'boolean']),
    required: z.boolean().default(false),
    description: z.string().optional()
  })).optional(),
  documentTypes: z.array(z.string()).optional()
});

export const fieldSelectionSchema = z.object({
  templateId: z.string().cuid().optional(),
  fields: z.array(z.object({
    name: z.string(),
    type: z.string(),
    required: z.boolean(),
    description: z.string().optional()
  }))
});

export const customFieldSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['text', 'number', 'date', 'currency', 'percentage', 'boolean']),
  description: z.string().optional(),
  required: z.boolean().default(false)
});

export const documentUploadSchema = z.object({
  documentType: z.enum([
    'CONTRACT_CERTIFICATION',
    'INVOICE',
    'RECEIPT',
    'LEGAL',
    'OTHER'
  ]).optional(),
  templateId: z.string().cuid().optional(),
});


/* ===========================
   CERTIFICATION SCHEMA
=========================== */
export const certificationSchema = z.object({
  cliente: z.string().min(2),
  contratista: z.string().min(2),
  fechaInicio: z.coerce.date(),   // Corrige z.string().date()
  fechaFin: z.coerce.date(),
  objeto: z.string().min(10),
  valorSinIva: z.number().positive(),
  valorConIva: z.number().positive(),
});

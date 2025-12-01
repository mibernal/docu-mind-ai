import { z } from 'zod';

export const createTemplateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  fields: z.string().min(1, 'Fields are required'),
  sampleData: z.string().optional(),
  category: z.string().default('general'),
  isDefault: z.boolean().default(false),
});

export const updateTemplateSchema = createTemplateSchema.partial();
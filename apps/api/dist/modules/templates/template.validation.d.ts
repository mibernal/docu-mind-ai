import { z } from 'zod';
export declare const createTemplateSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    fields: z.ZodString;
    sampleData: z.ZodOptional<z.ZodString>;
    category: z.ZodDefault<z.ZodString>;
    isDefault: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name: string;
    fields: string;
    category: string;
    isDefault: boolean;
    description?: string | undefined;
    sampleData?: string | undefined;
}, {
    name: string;
    fields: string;
    description?: string | undefined;
    sampleData?: string | undefined;
    category?: string | undefined;
    isDefault?: boolean | undefined;
}>;
export declare const updateTemplateSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    fields: z.ZodOptional<z.ZodString>;
    sampleData: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    category: z.ZodOptional<z.ZodDefault<z.ZodString>>;
    isDefault: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    description?: string | undefined;
    fields?: string | undefined;
    sampleData?: string | undefined;
    category?: string | undefined;
    isDefault?: boolean | undefined;
}, {
    name?: string | undefined;
    description?: string | undefined;
    fields?: string | undefined;
    sampleData?: string | undefined;
    category?: string | undefined;
    isDefault?: boolean | undefined;
}>;

import { z } from 'zod';
export declare const registerSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    name?: string | undefined;
}, {
    email: string;
    password: string;
    name?: string | undefined;
}>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const updateProfileSchema: z.ZodEffects<z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    email?: string | undefined;
}, {
    name?: string | undefined;
    email?: string | undefined;
}>, {
    name?: string | undefined;
    email?: string | undefined;
}, {
    name?: string | undefined;
    email?: string | undefined;
}>;
export declare const onboardingSchema: z.ZodObject<{
    useCase: z.ZodEnum<["CONTRACT_CERTIFICATION", "INVOICE_PROCESSING", "LEGAL_DOCUMENTS", "CUSTOM"]>;
    customFields: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        type: z.ZodEnum<["text", "number", "date", "currency", "percentage", "boolean"]>;
        required: z.ZodDefault<z.ZodBoolean>;
        description: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        type: "number" | "boolean" | "text" | "date" | "currency" | "percentage";
        required: boolean;
        description?: string | undefined;
    }, {
        name: string;
        type: "number" | "boolean" | "text" | "date" | "currency" | "percentage";
        description?: string | undefined;
        required?: boolean | undefined;
    }>, "many">>;
    documentTypes: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    useCase: "CONTRACT_CERTIFICATION" | "INVOICE_PROCESSING" | "LEGAL_DOCUMENTS" | "CUSTOM";
    customFields?: {
        name: string;
        type: "number" | "boolean" | "text" | "date" | "currency" | "percentage";
        required: boolean;
        description?: string | undefined;
    }[] | undefined;
    documentTypes?: string[] | undefined;
}, {
    useCase: "CONTRACT_CERTIFICATION" | "INVOICE_PROCESSING" | "LEGAL_DOCUMENTS" | "CUSTOM";
    customFields?: {
        name: string;
        type: "number" | "boolean" | "text" | "date" | "currency" | "percentage";
        description?: string | undefined;
        required?: boolean | undefined;
    }[] | undefined;
    documentTypes?: string[] | undefined;
}>;
export declare const fieldSelectionSchema: z.ZodObject<{
    templateId: z.ZodOptional<z.ZodString>;
    fields: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        type: z.ZodString;
        required: z.ZodBoolean;
        description: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        type: string;
        required: boolean;
        description?: string | undefined;
    }, {
        name: string;
        type: string;
        required: boolean;
        description?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    fields: {
        name: string;
        type: string;
        required: boolean;
        description?: string | undefined;
    }[];
    templateId?: string | undefined;
}, {
    fields: {
        name: string;
        type: string;
        required: boolean;
        description?: string | undefined;
    }[];
    templateId?: string | undefined;
}>;
export declare const customFieldSchema: z.ZodObject<{
    name: z.ZodString;
    type: z.ZodEnum<["text", "number", "date", "currency", "percentage", "boolean"]>;
    description: z.ZodOptional<z.ZodString>;
    required: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name: string;
    type: "number" | "boolean" | "text" | "date" | "currency" | "percentage";
    required: boolean;
    description?: string | undefined;
}, {
    name: string;
    type: "number" | "boolean" | "text" | "date" | "currency" | "percentage";
    description?: string | undefined;
    required?: boolean | undefined;
}>;
export declare const documentUploadSchema: z.ZodObject<{
    documentType: z.ZodOptional<z.ZodEnum<["CONTRACT_CERTIFICATION", "INVOICE", "RECEIPT", "LEGAL", "OTHER"]>>;
    templateId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    documentType?: "CONTRACT_CERTIFICATION" | "INVOICE" | "RECEIPT" | "OTHER" | "LEGAL" | undefined;
    templateId?: string | undefined;
}, {
    documentType?: "CONTRACT_CERTIFICATION" | "INVOICE" | "RECEIPT" | "OTHER" | "LEGAL" | undefined;
    templateId?: string | undefined;
}>;
export declare const certificationSchema: z.ZodObject<{
    cliente: z.ZodString;
    contratista: z.ZodString;
    fechaInicio: z.ZodDate;
    fechaFin: z.ZodDate;
    objeto: z.ZodString;
    valorSinIva: z.ZodNumber;
    valorConIva: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    cliente: string;
    contratista: string;
    fechaInicio: Date;
    fechaFin: Date;
    objeto: string;
    valorSinIva: number;
    valorConIva: number;
}, {
    cliente: string;
    contratista: string;
    fechaInicio: Date;
    fechaFin: Date;
    objeto: string;
    valorSinIva: number;
    valorConIva: number;
}>;

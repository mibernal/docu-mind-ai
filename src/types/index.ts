// src/types/index.ts - CORREGIR Y COMPLETAR
export interface User {
  id: string;
  email: string;
  name: string;
  plan: 'free' | 'pro' | 'business';
  createdAt: string;
  organization?: {
    id: string;
    name: string;
  };
  preferences?: {
    useCase: string;
    customFields?: CustomField[];
  };
  customFields?: CustomField[];
}

export interface UserPreferences {
  useCase: 'CONTRACT_CERTIFICATION' | 'INVOICE_PROCESSING' | 'LEGAL_DOCUMENTS' | 'CUSTOM';
  customFields?: CustomField[];
}

export interface CustomField {
  id?: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'currency' | 'percentage' | 'boolean';
  required: boolean;
  description?: string;
}

export interface PredefinedTemplate {
  name: string;
  description: string;
  fields: CustomField[];
}

// CORREGIR: Usar nombres más específicos para evitar conflictos
export type DocumentType = 'invoice' | 'receipt' | 'contract' | 'contract_certification' | 'legal' | 'other';
export type DocumentStatus = 'pending' | 'processing' | 'completed' | 'failed';

// INTERFAZ COMPLETA PARA DOCUMENTOS
export interface ProcessedDocument {
  id: string;
  filename: string;
  type: DocumentType;
  status: DocumentStatus;
  uploadedAt: string;
  processedAt?: string;
  confidence?: number;
  fileSize?: number;
  fileType?: string;
  fileUrl?: string;
  extractedData?: Record<string, any>;
  processingEngine?: string;
}

export interface ContractCertificationData {
  cliente: string;
  contratista: string;
  fechaInicio: string;
  fechaFin: string;
  objeto: string;
  numeroContrato: string;
  valorSinIva: number;
  valorConIva: number;
  valorSMMLV: number;
  valorSMMLVIva: number;
  duracionMeses: number;
  actividades: string[];
  firmante: string;
  cargoFirmante: string;
  nitContratista: string;
}

export interface DashboardMetrics {
  totalDocuments: number;
  successRate: number;
  averageProcessingTime: number;
  timeSaved: number;
  documentsByType: {
    type: DocumentType;
    count: number;
  }[];
}

export interface Template {
  id: string;
  name: string;
  description?: string;
  fields: TemplateField[];
  createdAt: string;
  updatedAt: string;
}

export interface TemplateField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'email' | 'select';
  required: boolean;
  options?: string[];
  validation?: {
    pattern?: string;
    min?: number;
    max?: number;
  };
}

export interface ExtractionResult {
  extractedData: Record<string, any>;
  confidence: number;
  documentType: string;
}

export interface DocumentMetrics {
  totalDocuments: number;
  processedDocuments: number;
  failedDocuments: number;
  timeSaved: number;
  successRate: number;
  documentsByType: Array<{
    type: string;
    count: number;
  }>;
}

export interface DocumentUploadResponse {
  documentId: string;
  message: string;
  status: string;
}

// ALIAS para compatibilidad (mantener temporalmente)
export type Document = ProcessedDocument;
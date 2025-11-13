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
}

// AGREGAR NUEVO TIPO DE DOCUMENTO
export type DocumentType = 'invoice' | 'receipt' | 'contract' | 'contract_certification' | 'legal' | 'other';
export type DocumentStatus = 'pending' | 'processing' | 'completed' | 'failed';

// AGREGAR INTERFAZ PARA CERTIFICACIONES DE CONTRATOS
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

// Extender la interfaz Document existente
export interface Document {
  id: string;
  filename: string;
  type: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  uploadedAt: string;
  processedAt?: string;
  confidence?: number;
  fileSize?: number;
  fileType?: string;
  fileUrl?: string;
  extractedData?: any;
  processingEngine?: string; // AGREGAR ESTE CAMPO
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
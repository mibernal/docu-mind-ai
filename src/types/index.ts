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

export type DocumentType = 'invoice' | 'receipt' | 'contract' | 'other';
export type DocumentStatus = 'processing' | 'completed' | 'failed';

export interface Document {
  id: string;
  filename: string;
  type: DocumentType;
  status: DocumentStatus;
  uploadedAt: string;
  processedAt?: string;
  extractedData?: Record<string, any>;
  confidence?: number;
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
  description: string;
  documentType: DocumentType;
  fields: TemplateField[];
  createdAt: string;
}

export interface TemplateField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'email';
  required: boolean;
}
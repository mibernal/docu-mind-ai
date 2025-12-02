import { User } from "./index";

// Tipos para las respuestas de la API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterResponse {
  user: User;
  token: string;
}

export interface UserProfileResponse {
  user: User & {
    organization: {
      id: string;
      name: string;
    };
    plan: string;
  };
}

export interface DashboardMetricsResponse {
  stats: {
    totalDocuments: number;
    processedDocuments: number;
    failedDocuments: number;
    timeSaved: number;
    successRate: number;
    averageProcessingTime: number;
    documentsByType: Array<{
      type: string;
      count: number;
    }>;
  };
}

export interface DocumentUploadResponse {
  documentId: string;
  filename: string;
  status: string;
  message: string;
}

export interface DocumentsResponse {
  documents: any[];
  total: number;
  page: number;
  totalPages: number;
}

export interface DocumentResponse {
  document: any;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  fields: TemplateField[];
  documentType: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateField {
  name: string;
  type: string;
  required: boolean;
  description?: string;
}

export interface TemplatesResponse {
  templates: Template[];
  total: number;
}

// Tipos para preferencias del usuario
export interface UserPreferences {
  useCase: 'CONTRACT_CERTIFICATION' | 'INVOICE_PROCESSING' | 'LEGAL_DOCUMENTS' | 'CUSTOM';
  customFields?: Array<{
    name: string;
    type: string;
    required: boolean;
    description?: string;
  }>;
  defaultTemplateId?: string;
  notifications: {
    email: boolean;
    push: boolean;
    processingComplete: boolean;
    errorAlert: boolean;
  };
}
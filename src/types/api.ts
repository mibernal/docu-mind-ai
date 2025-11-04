// src/types/api.ts
import { User } from './index';

// Tipos para las respuestas de la API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
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
  };
}

export interface DocumentUploadResponse {
  documentId: string;
  filename: string;
  status: string;
}
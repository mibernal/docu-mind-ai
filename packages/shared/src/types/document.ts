export interface DocumentTemplate {
  id: string;
  name: string;
  description?: string;
  fields: TemplateField[];
  extractionConfig: ExtractionConfig;
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplateField {
  name: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'array';
  required: boolean;
  description?: string;
  validation?: FieldValidation;
}

export interface FieldValidation {
  pattern?: string;
  min?: number;
  max?: number;
  options?: string[];
}

export interface ExtractionConfig {
  aiEngine: 'gemini' | 'openai' | 'fallback';
  prompt?: string;
  confidenceThreshold: number;
}

export interface ProcessedDocument {
  id: string;
  originalName: string;
  fileSize: number;
  mimeType: string;
  extractedData: Record<string, any>;
  confidence: number;
  status: ProcessingStatus;
  templateId?: string;
  userId: string;
  processedAt: Date;
  errors?: string[];
}

export type ProcessingStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'partially_completed';

export interface AIProcessingResult {
  data: Record<string, any>;
  confidence: number;
  warnings: string[];
  processedFields: string[];
}

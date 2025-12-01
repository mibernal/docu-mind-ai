export interface AIEngine {
  processText(text: string, template: any): Promise<AIProcessingResult>;
  validateConfig(config: any): boolean;
  getSupportedFormats(): string[];
}

export interface AIProcessingResult {
  data: Record<string, any>;
  confidence: number;
  warnings: string[];
  processedFields: string[];
}

export interface ProcessingConfig {
  engine: 'gemini' | 'openai' | 'fallback';
  apiKey?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

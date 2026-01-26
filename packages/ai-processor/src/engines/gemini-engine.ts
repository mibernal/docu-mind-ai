//packages/ai-processor/src/engines/gemini-engine.ts
import { AIEngine, AIProcessingResult, ProcessingConfig } from '../types';

export class GeminiEngine implements AIEngine {
  private config: ProcessingConfig;

  constructor(config: ProcessingConfig) {
    this.config = config;
  }

  async processText(text: string, template: any): Promise<AIProcessingResult> {
    // Implementación simplificada - expandir según necesidad
    console.log('Procesando con Gemini:', text.substring(0, 100));
    
    return {
      data: { processed: true, engine: 'gemini' },
      confidence: 0.95,
      warnings: [],
      processedFields: ['demo']
    };
  }

  validateConfig(config: ProcessingConfig): boolean {
    return !!config.apiKey;
  }

  getSupportedFormats(): string[] {
    return ['pdf', 'jpg', 'png', 'txt'];
  }
}

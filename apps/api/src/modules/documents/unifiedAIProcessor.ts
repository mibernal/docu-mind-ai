import { geminiProcessor } from "./geminiProcessor";
import { fallbackProcessor } from "./fallbackProcessor";

interface ExtractionResult {
  extractedData: Record<string, any>;
  confidence: number;
  documentType: string;
  processingEngine: string;
}

export class UnifiedAIProcessor {

  async processDocument(
    fileBuffer: Buffer,
    mimeType: string,
    filename: string
  ): Promise<ExtractionResult> {

    const preferredEngine = process.env.PREFERRED_AI_ENGINE || 'gemini';

    console.log('[UnifiedAIProcessor] Preferred engine:', preferredEngine);

    // 1️⃣ Intentar Gemini si está configurado
    if (preferredEngine === 'gemini') {
      try {
        const result = await geminiProcessor.processDocument(
          fileBuffer,
          mimeType,
          filename
        );

        // ⚠️ Validar resultado REAL, no solo errores
        if (
          result &&
          result.extractedData &&
          Object.keys(result.extractedData).length > 0
        ) {
          return result;
        }

        console.warn('[UnifiedAIProcessor] Gemini returned empty extraction, falling back', {
          filename
        });

      } catch (error) {
        console.error('[UnifiedAIProcessor] Gemini failed, falling back', error);
      }
    }

    // 2️⃣ Fallback SIEMPRE como respaldo real
    return await fallbackProcessor.processDocument(
      fileBuffer,
      mimeType,
      filename
    );
  }
}

export const unifiedAIProcessor = new UnifiedAIProcessor();

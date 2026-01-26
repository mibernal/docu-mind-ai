// apps/api/src/modules/documents/personalizedProcessor.ts
import { unifiedAIProcessor } from "./unifiedAIProcessor";
import { prisma } from "../../shared/db";
import { logger as sharedLogger } from "../../shared/logger";

interface PersonalizedExtractionResult {
  extractedData: Record<string, any>;
  confidence: number;
  documentType: string;
  processingEngine: string;
  userFieldsMatched: string[];
}

interface UserField {
  name: string;
  description?: string;
  type: string;
  required?: boolean;
}

interface UserPreferences {
  id: string;
  userId: string;
  customFields?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class PersonalizedProcessor {
  private readonly logger = sharedLogger;
  private readonly MIN_CONFIDENCE_FLOOR = 0.3;

  async processWithUserPreferences(
    fileBuffer: Buffer,
    mimeType: string,
    filename: string,
    userId: string
  ): Promise<PersonalizedExtractionResult> {
    let baseResult: any;

    try {
      const userPreferences = await this.getUserPreferences(userId);

      baseResult = await unifiedAIProcessor.processDocument(
        fileBuffer,
        mimeType,
        filename
      );

      // ⚠️ NO invalidamos resultados vacíos: los LLM pueden devolver {}
      if (!this.isExtractionResultShapeValid(baseResult)) {
        this.logger.warn("Invalid extraction result shape", {
          filename,
          baseResult
        });

        return this.createSafeEmptyResult(baseResult);
      }

      if (userPreferences) {
        return this.applyUserPreferences(baseResult, userPreferences, filename);
      }

      return {
        extractedData: baseResult.extractedData ?? {},
        confidence: this.normalizeConfidence(baseResult.confidence),
        documentType: baseResult.documentType || "other",
        processingEngine: this.normalizeEngine(baseResult.processingEngine),
        userFieldsMatched: Object.keys(baseResult.extractedData ?? {})
      };

    } catch (error: any) {
      this.logger.error("Personalized processing failed", {
        filename,
        userId,
        error: error?.message ?? error
      });

      // ⛑️ devolvemos resultado seguro, NO rompemos el pipeline
      return this.createSafeEmptyResult(baseResult);
    }
  }

  // -------------------------
  // Helpers
  // -------------------------

  private async getUserPreferences(userId: string): Promise<UserPreferences | null> {
    try {
      return await prisma.userPreferences.findUnique({
        where: { userId }
      });
    } catch (error) {
      this.logger.warn("Failed to fetch user preferences", { userId, error });
      return null;
    }
  }

  private isExtractionResultShapeValid(result: any): boolean {
    return Boolean(
      result &&
      typeof result === "object" &&
      result.extractedData &&
      typeof result.extractedData === "object"
    );
  }

  private createSafeEmptyResult(baseResult: any): PersonalizedExtractionResult {
    return {
      extractedData: {},
      confidence: this.MIN_CONFIDENCE_FLOOR,
      documentType: baseResult?.documentType || "other",
      processingEngine: this.normalizeEngine(baseResult?.processingEngine),
      userFieldsMatched: []
    };
  }

  private applyUserPreferences(
    baseResult: any,
    userPreferences: UserPreferences,
    filename: string
  ): PersonalizedExtractionResult {
    const userFields = this.parseUserFields(userPreferences.customFields);
    const { filteredData, matchedFields } =
      this.filterDataByUserFields(baseResult.extractedData ?? {}, userFields);

    const adjustedConfidence = this.calculateAdjustedConfidence(
      this.normalizeConfidence(baseResult.confidence),
      userFields,
      matchedFields
    );

    return {
      extractedData: filteredData,
      confidence: adjustedConfidence,
      documentType: baseResult.documentType || "other",
      processingEngine: this.normalizeEngine(baseResult.processingEngine, true),
      userFieldsMatched: matchedFields
    };
  }

  private parseUserFields(customFields?: string | null): UserField[] {
    if (!customFields) return [];

    try {
      const parsed = JSON.parse(customFields);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      this.logger.error("Invalid user customFields JSON", { error });
      return [];
    }
  }

  private filterDataByUserFields(
    extractedData: Record<string, any>,
    userFields: UserField[]
  ): { filteredData: Record<string, any>; matchedFields: string[] } {
    const filteredData: Record<string, any> = {};
    const matchedFields: string[] = [];

    if (userFields.length > 0) {
      for (const field of userFields) {
        if (field.name in extractedData) {
          filteredData[field.name] = extractedData[field.name];
          matchedFields.push(field.name);
        }
      }
    } else {
      Object.assign(filteredData, extractedData);
      matchedFields.push(...Object.keys(extractedData));
    }

    return { filteredData, matchedFields };
  }

  private calculateAdjustedConfidence(
    baseConfidence: number,
    userFields: UserField[],
    matchedFields: string[]
  ): number {
    const requiredFields = userFields.filter(f => f.required);

    if (requiredFields.length === 0) {
      return baseConfidence;
    }

    const requiredMatched = requiredFields.filter(f =>
      matchedFields.includes(f.name)
    ).length;

    const matchRatio = requiredMatched / requiredFields.length;

    return Math.max(
      baseConfidence * matchRatio,
      this.MIN_CONFIDENCE_FLOOR
    );
  }

  private normalizeConfidence(value: any): number {
    if (typeof value !== "number" || isNaN(value)) {
      return this.MIN_CONFIDENCE_FLOOR;
    }
    return Math.min(Math.max(value, this.MIN_CONFIDENCE_FLOOR), 1);
  }

  private normalizeEngine(engine?: string, personalized = false): string {
    const base = engine || "unknown";
    return personalized ? `${base}_personalized` : base;
  }

  // -------------------------
  // Prompt helper
  // -------------------------

  generateCustomPrompt(userFields: UserField[], documentType: string): string {
    if (userFields.length === 0) {
      return "Extrae toda la información relevante del documento en formato JSON.";
    }

    const fieldDescriptions = userFields
      .map(f => `- ${f.name} (${f.type})${f.required ? " [REQUERIDO]" : ""}`)
      .join("\n");

    return `
Extrae SOLO los siguientes campos del documento (${documentType}):

${fieldDescriptions}

Reglas:
- Devuelve únicamente JSON válido
- Campos ausentes → null
- Fechas: YYYY-MM-DD
- Números sin símbolos

Respuesta esperada:
{
  "campo": "valor | null"
}
`.trim();
  }
}

export const personalizedProcessor = new PersonalizedProcessor();

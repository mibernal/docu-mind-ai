// src/services/personalizedProcessor.ts
import { unifiedAIProcessor } from "./unifiedAIProcessor";
import { prisma } from "../../shared/db";
export class PersonalizedProcessor {
    async processWithUserPreferences(fileBuffer, mimeType, filename, userId) {
        // Obtener preferencias del usuario
        const userPreferences = await prisma.userPreferences.findUnique({
            where: { userId }
        });
        // Procesar documento normalmente primero
        const baseResult = await unifiedAIProcessor.processDocument(fileBuffer, mimeType, filename);
        // Aplicar personalización basada en preferencias
        if (userPreferences) {
            return this.applyUserPreferences(baseResult, userPreferences, filename);
        }
        return {
            ...baseResult,
            userFieldsMatched: Object.keys(baseResult.extractedData)
        };
    }
    applyUserPreferences(baseResult, userPreferences, filename) {
        const userFields = userPreferences.customFields ?
            JSON.parse(userPreferences.customFields) : [];
        let filteredData = {};
        const matchedFields = [];
        // Filtrar y priorizar campos que el usuario quiere
        if (userFields.length > 0) {
            userFields.forEach((field) => {
                const fieldName = field.name;
                if (baseResult.extractedData[fieldName] !== undefined) {
                    filteredData[fieldName] = baseResult.extractedData[fieldName];
                    matchedFields.push(fieldName);
                }
            });
        }
        else {
            // Si no hay campos personalizados, usar todos los campos extraídos
            filteredData = baseResult.extractedData;
            matchedFields.push(...Object.keys(baseResult.extractedData));
        }
        // Ajustar confianza basada en cuántos campos requeridos coincidieron
        const requiredFields = userFields.filter((f) => f.required);
        const requiredMatched = requiredFields.filter((f) => matchedFields.includes(f.name)).length;
        const matchRatio = requiredFields.length > 0 ?
            requiredMatched / requiredFields.length : 1;
        const adjustedConfidence = baseResult.confidence * matchRatio;
        return {
            extractedData: filteredData,
            confidence: adjustedConfidence,
            documentType: baseResult.documentType,
            processingEngine: `${baseResult.processingEngine}_personalized`,
            userFieldsMatched: matchedFields
        };
    }
    // Generar prompt personalizado para IA basado en campos del usuario
    generateCustomPrompt(userFields, documentType) {
        const fieldDescriptions = userFields.map(field => `- ${field.name}: ${field.description || 'Sin descripción'} (tipo: ${field.type})`).join('\n');
        return `
      Extrae SOLO la siguiente información del documento. 
      Si no encuentras algún campo, déjalo vacío o usa null.
      
      Campos requeridos por el usuario:
      ${fieldDescriptions}

      Tipo de documento: ${documentType}

      Responde EXCLUSIVAMENTE con un JSON que contenga estos campos.
      Para campos numéricos, convierte a números.
      Para fechas, usa formato YYYY-MM-DD.
    `;
    }
}
export const personalizedProcessor = new PersonalizedProcessor();

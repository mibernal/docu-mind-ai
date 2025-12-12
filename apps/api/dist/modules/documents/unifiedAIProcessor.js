//server\src\services\unifiedAIProcessor.ts
import { geminiProcessor } from "./geminiProcessor";
import { fallbackProcessor } from "./fallbackProcessor";
export class UnifiedAIProcessor {
    async processDocument(fileBuffer, mimeType, filename) {
        const preferredEngine = process.env.PREFERRED_AI_ENGINE || 'fallback';
        console.log(`Using AI engine: ${preferredEngine}`);
        try {
            if (preferredEngine === 'gemini') {
                return await geminiProcessor.processDocument(fileBuffer, mimeType, filename);
            }
            else {
                // Use enhanced fallback
                return await fallbackProcessor.processDocument(fileBuffer, mimeType, filename);
            }
        }
        catch (error) {
            console.error(`Primary engine failed, using enhanced fallback:`, error);
            return await fallbackProcessor.processDocument(fileBuffer, mimeType, filename);
        }
    }
}
export const unifiedAIProcessor = new UnifiedAIProcessor();

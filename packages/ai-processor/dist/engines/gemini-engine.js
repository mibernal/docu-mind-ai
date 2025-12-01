export class GeminiEngine {
    config;
    constructor(config) {
        this.config = config;
    }
    async processText(text, template) {
        // Implementación simplificada - expandir según necesidad
        console.log('Procesando con Gemini:', text.substring(0, 100));
        return {
            data: { processed: true, engine: 'gemini' },
            confidence: 0.95,
            warnings: [],
            processedFields: ['demo']
        };
    }
    validateConfig(config) {
        return !!config.apiKey;
    }
    getSupportedFormats() {
        return ['pdf', 'jpg', 'png', 'txt'];
    }
}

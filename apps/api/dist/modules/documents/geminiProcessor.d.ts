interface ExtractionResult {
    extractedData: Record<string, any>;
    confidence: number;
    documentType: string;
    processingEngine: string;
}
export declare class GeminiProcessor {
    private availableModels;
    private currentModelIndex;
    private tryWithNextModel;
    private extractTextWithOCR;
    private generateSimulatedText;
    private makeGeminiRequest;
    processDocument(fileBuffer: Buffer, mimeType: string, filename: string): Promise<ExtractionResult>;
    private classifyWithGemini;
    private extractWithGemini;
    private postProcessContractCertification;
    private calculateConfidence;
    private keywordClassification;
    private fallbackExtraction;
    private fallbackProcessing;
}
export declare const geminiProcessor: GeminiProcessor;
export {};

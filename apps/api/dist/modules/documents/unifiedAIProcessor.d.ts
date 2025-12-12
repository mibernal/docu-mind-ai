interface ExtractionResult {
    extractedData: Record<string, any>;
    confidence: number;
    documentType: string;
    processingEngine: string;
}
export declare class UnifiedAIProcessor {
    processDocument(fileBuffer: Buffer, mimeType: string, filename: string): Promise<ExtractionResult>;
}
export declare const unifiedAIProcessor: UnifiedAIProcessor;
export {};

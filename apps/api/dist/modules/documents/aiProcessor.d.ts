interface ExtractionResult {
    extractedData: Record<string, any>;
    confidence: number;
    documentType: string;
}
export declare class AIProcessor {
    private extractTextWithOCR;
    private generateSimulatedText;
    private processWithFallback;
    private fallbackExtraction;
    private extractInvoiceFallback;
    private extractContractFallback;
    private extractReceiptFallback;
    private extractOtherFallback;
    processDocument(fileBuffer: Buffer, mimeType: string, filename: string): Promise<ExtractionResult>;
    private classifyDocument;
    private extractStructuredData;
}
export declare const aiProcessor: AIProcessor;
export {};

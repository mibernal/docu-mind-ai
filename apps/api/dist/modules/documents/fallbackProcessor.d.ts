interface ExtractionResult {
    extractedData: Record<string, any>;
    confidence: number;
    documentType: string;
    processingEngine: string;
}
export declare class FallbackProcessor {
    private SMMLV_2025;
    processDocument(fileBuffer: Buffer, mimeType: string, filename: string): Promise<ExtractionResult>;
    private simulateOCR;
    private generateBacConText;
    private generateActaLiquidacionText;
    private generateContractText;
    private generateGenericText;
    private enhancedClassification;
    private enhancedExtraction;
    private extractContractCertification;
    private extractInvoiceData;
    private calculateEnhancedConfidence;
}
export declare const fallbackProcessor: FallbackProcessor;
export {};

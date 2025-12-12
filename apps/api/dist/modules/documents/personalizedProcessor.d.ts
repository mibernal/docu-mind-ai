interface PersonalizedExtractionResult {
    extractedData: Record<string, any>;
    confidence: number;
    documentType: string;
    processingEngine: string;
    userFieldsMatched: string[];
}
export declare class PersonalizedProcessor {
    processWithUserPreferences(fileBuffer: Buffer, mimeType: string, filename: string, userId: string): Promise<PersonalizedExtractionResult>;
    private applyUserPreferences;
    generateCustomPrompt(userFields: any[], documentType: string): string;
}
export declare const personalizedProcessor: PersonalizedProcessor;
export {};

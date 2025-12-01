import { AIEngine, AIProcessingResult, ProcessingConfig } from '../types';
export declare class GeminiEngine implements AIEngine {
    private config;
    constructor(config: ProcessingConfig);
    processText(text: string, template: any): Promise<AIProcessingResult>;
    validateConfig(config: ProcessingConfig): boolean;
    getSupportedFormats(): string[];
}

import { AIEngine, AIProcessingResult } from '../types';
export declare class UnifiedAIProcessor {
    private engines;
    registerEngine(name: string, engine: AIEngine): void;
    process(engineName: string, text: string, template: any): Promise<AIProcessingResult>;
    getAvailableEngines(): string[];
}

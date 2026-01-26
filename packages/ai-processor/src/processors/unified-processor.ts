//packages/ai-processor/src/processors/unified-processor.ts
import { AIEngine, AIProcessingResult, ProcessingConfig } from '../types';
import { GeminiEngine } from '../engines/gemini-engine';

export class UnifiedAIProcessor {
  private engines: Map<string, AIEngine> = new Map();

  registerEngine(name: string, engine: AIEngine) {
    this.engines.set(name, engine);
  }

  async process(
    engineName: string,
    text: string, 
    template: any
  ): Promise<AIProcessingResult> {
    const engine = this.engines.get(engineName);
    if (!engine) {
      throw new Error(`Engine ${engineName} not found`);
    }
    
    return engine.processText(text, template);
  }

  getAvailableEngines(): string[] {
    return Array.from(this.engines.keys());
  }
}

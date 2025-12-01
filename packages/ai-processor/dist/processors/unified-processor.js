export class UnifiedAIProcessor {
    engines = new Map();
    registerEngine(name, engine) {
        this.engines.set(name, engine);
    }
    async process(engineName, text, template) {
        const engine = this.engines.get(engineName);
        if (!engine) {
            throw new Error(`Engine ${engineName} not found`);
        }
        return engine.processText(text, template);
    }
    getAvailableEngines() {
        return Array.from(this.engines.keys());
    }
}

import ModelProvider from './ModelProvider';
import { Models } from '@hve/chatai';
import {
    initOpenAIProvider,
    initGeminiProvider,
    initClaudeProvider,
    initVertexAIProvider,
} from './providerInitializer';

class ChatAIModelManager {
    #provdierNames: string[] = [];
    #providers: Map<string, ModelProvider> = new Map();
    #modelIds:Map<string, string> = new Map();
    #models:ChatAIModels;

    constructor() {
        this.#initialize();

        this.#models = [];
        for (const providerName of this.#provdierNames) {
            const provider = this.#providers.get(providerName) as ModelProvider;
            const providerModel:ChatAIModelProviders = {
                name : providerName,
                list : provider.categories,
            }
            this.#models.push(providerModel);

            for (const category of provider.categories) {
                for (const modelItem of category.list) {
                    this.#modelIds.set(modelItem.id, modelItem.name);
                }
            }
        }
    }

    #initialize() {
        const openAIProvider = this.#addProvider('OpenAI', Models.OPENAI_GPT);
        initOpenAIProvider(openAIProvider);

        const geminiProvider = this.#addProvider('Google', Models.GOOGLE_GEMINI);
        initGeminiProvider(geminiProvider);

        const claudeProvider = this.#addProvider('Anthropic', Models.CLAUDE);
        initClaudeProvider(claudeProvider);

        const vertexAIProvider = this.#addProvider('VertexAI', Models.GOOGLE_VERTEXAI);
        initVertexAIProvider(vertexAIProvider);
    }

    #addProvider(name:string, providerId: Models) {
        if (this.#providers.has(name)) {
            return this.#providers.get(name) as ModelProvider;
        }
        else {
            const provider = new ModelProvider(providerId);

            this.#provdierNames.push(name);
            this.#providers.set(name, provider);

            return provider;
        }
    }

    get models() {
        return this.#models;
    }
}

export default ChatAIModelManager;
import ModelProvider from './ModelProvider';
import {
    initOpenAIProvider,
    initGeminiProvider,
    initClaudeProvider,
    initVertexAIProvider,
    initDebugProvider,
} from './providerInitializer';

const KnownProducer = {
    OpenAI: 'openai',
    Google: 'google',
    Anthropic: 'anthropic',
    VertexAI: 'vertexai',
    Debug: 'debug',
} as const;
type KnownProducer = (typeof KnownProducer)[keyof typeof KnownProducer];


class ChatAIModelManager {
    #provdierNames: string[] = [];
    #providers: Map<string, ModelProvider> = new Map();
    #modelIds: Map<string, ChatAIModel> = new Map();
    #models: ChatAIModels = [];

    constructor() {
        this.#loadDefaultModel();

        for (const providerName of this.#provdierNames) {
            const provider = this.#providers.get(providerName) as ModelProvider;
            const providerModel: ChatAIModelProviders = {
                name: providerName,
                list: provider.categories,
            }
            this.#models.push(providerModel);

            for (const category of provider.categories) {
                for (const modelItem of category.list) {
                    this.#modelIds.set(modelItem.id, modelItem);
                }
            }
        }
    }

    #loadDefaultModel() {
        const openAIProvider = this.#addProvider('OpenAI', KnownProducer.OpenAI);
        initOpenAIProvider(openAIProvider);

        const geminiProvider = this.#addProvider('Google', KnownProducer.Google);
        initGeminiProvider(geminiProvider);

        const claudeProvider = this.#addProvider('Anthropic', KnownProducer.Anthropic);
        initClaudeProvider(claudeProvider);

        const vertexAIProvider = this.#addProvider('VertexAI', KnownProducer.VertexAI);
        initVertexAIProvider(vertexAIProvider);

        // const debugProvider = this.#addProvider('Debug', 'debug');
        // initDebugProvider(debugProvider);
    }

    #addProvider(name: string, providerId: KnownProducer) {
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

    getModel(id: string): ChatAIModel | undefined {
        return this.#modelIds.get(id);
    }

    get models() {
        return this.#models;
    }
}

export default ChatAIModelManager;
class ModelProvider {
    #providerName:string;
    #categories:ChatAIMoedelCategory[];

    constructor(providerName:string) {
        this.#providerName = providerName;
        this.#categories = [];
    }

    addModels(
        name:string,
        models:Omit<ChatAIModel, 'id'|'providerName'|'providerDisplayName'>[]=[]
    ) {
        const list = models.map((model) => {
            return {
                id: `${this.#providerName}:${model.name}`,
                name: model.name,
                displayName: model.displayName,
                providerName: this.#providerName,
                providerDisplayName: this.#providerName,
                flags: model.flags,
            } as ChatAIModel;
        });

        this.#categories.push({ name, list });
    }

    get categories() {
        return this.#categories;
    }
}

export default ModelProvider;
class ModelProvider {
    #providerName:string;
    #categories:ChatAIMoedelCategory[];

    constructor(providerName:string) {
        this.#providerName = providerName;
        this.#categories = [];
    }

    addModels(
        name:string,
        models:Omit<ChatAIModel, 'id'>[]=[]
    ) {
        const list = models.map((model) => {
            return {
                id: `${this.#providerName}:${model.value}`,
                name: model.name,
                value: model.value,
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
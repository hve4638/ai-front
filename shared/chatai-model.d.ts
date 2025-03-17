declare global {
    type ChatAIModelFlags = {
        featured? : boolean;
        stable? : boolean;
        latest? : boolean;
        experimental? : boolean;
        deprecated? : boolean;
        legacy? : boolean;
        snapshot? : boolean;
    }
    type ChatAIModel = {
        id: string;
        name: string;
        displayName: string;
        providerName: string;
        providerDisplayName: string;
        flags : ChatAIModelFlags;
    }
    type ChatAIMoedelCategory = {
        name : string;
        list : ChatAIModel[];
    };
    type ChatAIModelProviders = {
        name : string;
        list : ChatAIMoedelCategory[];
    };
    type ChatAIModels = ChatAIModelProviders[];
}

export {};
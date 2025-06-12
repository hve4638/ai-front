import '../prompt-form';

declare global {
    type RTTemplate = 'basic'|'chat';

    type RTMetadata = {
        name : string;
        id : string;
        mode : RTMode;
    }
    
    /**
     * RT 트리 구조
     */
    type RTMetadataTree = (
        RTMetadataNode | RTMetadataDirectory
    )[];
    type RTMetadataNode = {
        type : 'node';
        name : string;
        id : string;
    }
    type RTMetadataDirectory = {
        type : 'directory';
        name : string;
        children : RTMetadataNode[];
    }


    type RTMode = 'prompt_only' | 'flow';

    type RTInput = {
        input : string;
        chat? : RTInputMessage[];

        form: Record<string, any>;
        modelId: string;
        rtId: string;
        sessionId: string;
    }
    type RTInputMessage = {
        type : 'chat';
        message : RTInputMessagePart[];
    }
    type RTInputMessagePart = {
        type : 'text'|'image';
        value : string;
    }
}

export {};
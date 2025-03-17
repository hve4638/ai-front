import './prompt-form';

declare global {
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
    type RTPromptData = {
        name?: string|null; // flow 모드에서는 null
        id : string;
        inputType? : 'text'|'chat';
        forms? : PromptVar[];
        contents? : string;
    }

    type RTInput = {
        message : RTInputMessage[];
        form: Record<string, any>;
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
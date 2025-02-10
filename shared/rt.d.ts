declare global {
    type RTMetadata = {
        type : 'node';
        name : string;
        id : string;
    }

    type RTMetadataDirectory = {
        type : 'directory';
        name : string;
        children : RTMetadata[];
    }

    type RTMetadataTree = (
        RTMetadata | RTMetadataDirectory
    )[];

    type RTMode = 'simple' | 'flow';
    
    type RTPromptData = {
        name?: string|null; // flow 모드에서는 null
        id : string;
        inputType? : 'text'|'chat';
        forms? : PromptVar[];
        contents? : string;
    }
}

export {};
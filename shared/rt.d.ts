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
    
    type RTSimpleModeData = {
        inputType? : 'text'|'chat';
        forms? : PromptVar[];
        name? : string;
        id : string;
        contents? : string;
    }
}

export {};
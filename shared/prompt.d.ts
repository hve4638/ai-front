declare global {
    type RTMetadata = {
        type : 'node';
        name : string;
        id : string;
    }

    type RTDirectory = {
        type : 'directory';
        name : string;
        children : RTMetadata[];
    }

    type RTMetadataTree = (
        RTMetadata | RTDirectory
    )[];

    type RTMode = 'simple' | 'flow';
}

export {};
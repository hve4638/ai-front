
export interface ChatSessionStruct {
    id:number;
    historyKey:string;
    promptKey:string;
    modelKey:string;
    promptVariable:{[key:string]:string};
}

export interface ChatSessionTabStruct {
    name: string|null;
    color: string;
    deleteLock: boolean;
    
    promptKey: string;
    modelKey: string;

    link: number;
}


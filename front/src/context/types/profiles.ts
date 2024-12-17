export interface ChatSession {
    id:number;
    promptKey:string;
    modelKey:string;
    note:{[key:string]:string};
    
    color:string|null;
    
    historyKey:string;
}
// export interface ChatSessionTab {
//     name: string|null;
//     color: SessionColor;
//     deleteLock: boolean;
    
//     promptKey: string;
//     modelKey: string;

//     link: string;
// }

export interface ChatSessionData {
    id:number;
    promptKey:string;
    modelKey:string;
    note:{[key:string]:string};
    color:string|null;

    input : string;
    output : {
        type: string;
        content: [];
    };
    
    historyKey:string;
}
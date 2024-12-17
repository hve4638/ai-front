import {
    ChatSessionColor,
    ChatSessionStatus,
} from './enums';

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
export interface ChatSessionTab {
    name: string|null;
    color: ChatSessionColor;
    deleteLock: boolean; 
    
    promptKey: string;
    modelKey: string;

    tabOrder : number;
    status: ChatSessionStatus;
    link: number;
}
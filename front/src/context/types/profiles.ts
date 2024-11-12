export interface ChatSession {
    id:number;
    promptKey:string;
    note:{[key:string]:string};
    modelCategory:string;
    modelName:string;
    color:string|null;
    historyKey:string;
    historyIsolation:boolean;
    chatIsolation:boolean;
}
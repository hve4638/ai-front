import { APIResponse } from "../data/interface";


export interface SessionHistory {
    [key:number]:APIResponse[]
}
export interface SessionResponse {
    [key:number]:APIResponse
}
export interface Chats {
    [key:number]:Chat
}
export interface Chat {
    input:string;
    output:string;
}

export interface ChatSession {
    id:number;
    promptKey:string;
    note:Note;
    modelCategory:string;
    model:string;
    color:string|null;
    historyKey:string;
    historyIsolation:boolean;
    chatIsolation:boolean;
}
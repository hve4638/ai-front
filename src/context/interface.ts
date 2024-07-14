import { APIResponse, Note } from "../data/interface";


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
    modelName:string;
    color:string|null;
    historyKey:string;
    historyIsolation:boolean;
    chatIsolation:boolean;
}

export type useStateCallback<T> = (x:T|((x:T)=>T))=>void;
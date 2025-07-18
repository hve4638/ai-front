export interface ChatSession {
    id:string;
    name?:string;
    color?:string;
    deleteLock:boolean;
    modelKey:string;
    promptKey:string;
}
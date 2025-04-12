export interface ProfileSessionMetadata {
    id:string;
    name?:string;
    color?:string;
    deleteLock:boolean;
    modelId:string;
    rtId:string;
    state: 'idle'| 'loading' | 'error' | 'done';
}
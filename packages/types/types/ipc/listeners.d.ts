import './result';

declare global {
    type IPCListenersInterface = {
        AddRequestListener(listener:(event:any, token:string, data:any)=>void): EResult<number>;
        RemoveRequestListener(bindId:number): ENoResult;
    }
}


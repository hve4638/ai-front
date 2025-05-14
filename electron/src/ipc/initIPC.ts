import { ipcMain } from 'electron';
import { IPCInvokerName } from 'types';
import getHandlers from './handlers';
import { updateRegistry } from '@/runtime';

export function initIPC() {
    const handlers:IPCInvokerInterface = getHandlers();

    for(const category in handlers) {
        for (const invokeKey in handlers[category]) {
            const handler = handlers[category][invokeKey]
            handleIPC(`${category}_${invokeKey}`, handler);
        }
    }
    
    updateRegistry({ ipcFrontAPI : handlers });
}

function handleIPC(ping:string, callback:any) {
    const handler = async (event: any, ...args: any) => {
        console.log(`[IPC] ${ping}`, ...args);
        try {
            const result = await callback(...args);
            return result;
        }
        catch (error:any) {
            console.error(`[IPC][ERROR] ${ping}`, ...args);
            console.error(error);
            
            return [makeErrorStruct(error)];
        }
    };

    ipcMain.handle(ping, handler);

    return handler;
}

function makeErrorStruct(error:any) {
    try {
        return {
            name : error.name,
            message : error.message,
        }
    }
    catch(error) {
        return {
            name : 'UnknownError',
            message : 'Unknown error',
        }
    }
}
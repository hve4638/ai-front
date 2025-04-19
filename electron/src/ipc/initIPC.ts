import { ipcMain } from 'electron';
import { IPCInvokerName } from 'types';
import getHandlers from './handlers';
import { updateRegistry } from '@/runtime';

export function initIPC() {
    const handlers = getHandlers();

    for(const ping in handlers) {
        const handler = handlers[ping as IPCInvokerName];
        handleIPC(ping as IPCInvokerName, handler);
    }

    updateRegistry({ ipcFrontAPI : handlers });
}

function handleIPC(ping:IPCInvokerName, callback:any) {
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
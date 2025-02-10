import { ipcMain } from 'electron';
import { IPCCommand } from 'types';
import getHandlers from './handlers';

export function initIPC() {
    const handlers = getHandlers();

    for(const ping in handlers) {
        const handler = handlers[ping as IPCCommand];
        handleIPC(ping as IPCCommand, handler);
    }
}

function handleIPC(ping:IPCCommand, callback:any) {
    ipcMain.handle(ping, async (event: any, ...args: any) => {
        try {
            const result = await callback(...args);
            return result;
        }
        catch (error:any) {
            return [makeErrorStruct(error)];
        }
    });
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
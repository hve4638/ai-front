import { ipcMain } from 'electron';
import ipcping from './ipcping';
import getHandlers from './handlers';

type PINGS = typeof ipcping[keyof typeof ipcping];

export function initIPC() {
    const handlers = getHandlers();

    for(const ping in handlers) {
        const handler = handlers[ping as keyof typeof handlers];
        handleIPC(ping as keyof typeof handlers, handler);
    }
}

function handleIPC(ping:PINGS, callback:any) {
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
import { ipcMain } from 'electron';
import ipcping from './ipcping';
import { getIPCHandler } from './ipcHandler';
import type { IPCDependencies } from './ipcHandler';

type PINGS = typeof ipcping[keyof typeof ipcping];

function ipcHandle(ping:PINGS, callback:any) {
    ipcMain.handle(ping, (event: any, ...args: any) => {
        try {
            const result = callback(...args);
            return result;
        }
        catch (error) {
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

export function initIPC(dependencies: IPCDependencies) {
    const handlers = getIPCHandler(dependencies);

    ipcHandle(ipcping.ECHO, handlers.echo);
    ipcHandle(ipcping.OPEN_BROWSER, handlers.openBrowser);
    ipcHandle(ipcping.OPEN_PROMPT_DIRECTORY, handlers.openPromptDirectory);
    ipcHandle(ipcping.FETCH, handlers.fetch);
    ipcHandle(ipcping.ABORT_FETCH, handlers.abortFetch);
    ipcHandle(ipcping.GET_FETCH_RESPONSE, handlers.getFetchResponse);
    ipcHandle(ipcping.LOAD_ROOT_PROMPT_METADATA, handlers.loadRootPromptMetadata);
    ipcHandle(ipcping.LOAD_MODULE_PROMPT_METADATA, handlers.loadModulePromptMetadata);
    ipcHandle(ipcping.LOAD_PROMPT_TEMPLATE, handlers.loadPromptTemplate);
    ipcHandle(ipcping.GET_PROFILE_NAMES, handlers.getProfileNames);
    ipcHandle(ipcping.CREATE_PROFILE, handlers.createProfile);
    ipcHandle(ipcping.DELETE_PROFILE, handlers.deleteProfile);
    ipcHandle(ipcping.LOAD_PROFILE_VALUE, handlers.loadProfileValue);
    ipcHandle(ipcping.STORE_PROFILE_VALUE, handlers.storeProfileValue);

    ipcHandle(ipcping.LOAD_PROFILE_HISTORY_COUNT, handlers.loadProfileHistoryCount);
    ipcHandle(ipcping.LOAD_PROFILE_HISTORY, handlers.loadProfileHistory);
    ipcHandle(ipcping.STORE_PROFILE_HISTORY, handlers.storeProfileHistory);
    ipcHandle(ipcping.DELETE_PROFILE_HISTORY, handlers.deleteProfileHistory);
    ipcHandle(ipcping.DELETE_ALL_PROFILE_HISTORY, handlers.deleteAllProfileHistory);

    ipcHandle(ipcping.SET_LAST_PROFILE_NAME, handlers.setLastProfileName);
    ipcHandle(ipcping.GET_LAST_PROFILE_NAME, handlers.getLastProfileName);

    ipcHandle(ipcping.WRITE_LOG, handlers.writeLog);
}

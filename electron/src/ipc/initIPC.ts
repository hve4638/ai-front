import { ipcMain } from 'electron';
import ipcping from './ipcping';
import { getIPCHandler } from './ipcHandler';
import type { IPCDependencies } from './ipcHandler';

type PINGS = typeof ipcping[keyof typeof ipcping];

export function initIPC(dependencies: IPCDependencies) {
    const handlers = getIPCHandler(dependencies);

    handleIPC(ipcping.ECHO, handlers.echo);
    handleIPC(ipcping.OPEN_BROWSER, handlers.openBrowser);
    handleIPC(ipcping.OPEN_PROMPT_DIRECTORY, handlers.openPromptDirectory);
    handleIPC(ipcping.FETCH, handlers.fetch);
    handleIPC(ipcping.ABORT_FETCH, handlers.abortFetch);
    handleIPC(ipcping.GET_FETCH_RESPONSE, handlers.getFetchResponse);
    handleIPC(ipcping.LOAD_ROOT_PROMPT_METADATA, handlers.loadRootPromptMetadata);
    handleIPC(ipcping.LOAD_MODULE_PROMPT_METADATA, handlers.loadModulePromptMetadata);
    handleIPC(ipcping.LOAD_PROMPT_TEMPLATE, handlers.loadPromptTemplate);
    handleIPC(ipcping.GET_PROFILE_NAMES, handlers.getProfileNames);
    handleIPC(ipcping.CREATE_PROFILE, handlers.createProfile);
    handleIPC(ipcping.DELETE_PROFILE, handlers.deleteProfile);
    handleIPC(ipcping.LOAD_PROFILE_VALUE, handlers.loadProfileValue);
    handleIPC(ipcping.STORE_PROFILE_VALUE, handlers.storeProfileValue);

    handleIPC(ipcping.LOAD_GLOBAL_VALUE, handlers.loadGlobalValue);
    handleIPC(ipcping.STORE_GLOBAL_VALUE, handlers.storeGlobalValue);

    handleIPC(ipcping.LOAD_PROFILE_HISTORY_COUNT, handlers.loadProfileHistoryCount);
    handleIPC(ipcping.LOAD_PROFILE_HISTORY, handlers.loadProfileHistory);
    handleIPC(ipcping.STORE_PROFILE_HISTORY, handlers.storeProfileHistory);
    handleIPC(ipcping.DELETE_PROFILE_HISTORY, handlers.deleteProfileHistory);
    handleIPC(ipcping.DELETE_ALL_PROFILE_HISTORY, handlers.deleteAllProfileHistory);

    handleIPC(ipcping.SET_LAST_PROFILE_NAME, handlers.setLastProfileName);
    handleIPC(ipcping.GET_LAST_PROFILE_NAME, handlers.getLastProfileName);

    handleIPC(ipcping.WRITE_LOG, handlers.writeLog);
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
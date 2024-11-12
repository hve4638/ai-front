import { contextBridge, ipcRenderer } from 'electron';
import { ipcping } from './ipc';

const api:IPC_TYPES = {
    echo: (message:string) => ipcRenderer.invoke(ipcping.ECHO, message),
    openBrowser: (url:string) => ipcRenderer.invoke(ipcping.OPEN_BROWSER, url),
    openPromptDirectory: (profileName:string) => ipcRenderer.invoke(ipcping.OPEN_PROMPT_DIRECTORY, profileName),

    fetch: (url:string, init:Object) => ipcRenderer.invoke(ipcping.FETCH, url, init),
    abortFetch: (fetchID:number) => ipcRenderer.invoke(ipcping.ABORT_FETCH, fetchID),
    getFetchResponse : (fetchID:number) => ipcRenderer.invoke(ipcping.GET_FETCH_RESPONSE, fetchID),

    loadRootPromptMetadata : (profileName:string) => ipcRenderer.invoke(ipcping.LOAD_ROOT_PROMPT_METADATA, profileName),
    loadModulePromptMetadata : (profileName:string, moduleName:string) => ipcRenderer.invoke(ipcping.LOAD_MODULE_PROMPT_METADATA, profileName, moduleName),
    loadPromptTemplate: (profileName:string, moduleName:string, filename:string) => ipcRenderer.invoke(ipcping.LOAD_PROMPT_TEMPLATE, profileName, moduleName, filename),

    getProfileNames: () => ipcRenderer.invoke(ipcping.GET_PROFILE_NAMES),
    createProfile: (profileName:string) => ipcRenderer.invoke(ipcping.CREATE_PROFILE, profileName),
    deleteProfile: (profileName:string) => ipcRenderer.invoke(ipcping.DELETE_PROFILE, profileName),

    loadProfileValue: (profileName:string, storageName:string, key:string) => ipcRenderer.invoke(ipcping.LOAD_PROFILE_VALUE, profileName, storageName, key),
    storeProfileValue: (profileName:string, storageName:string, key:string, value:any) => ipcRenderer.invoke(ipcping.STORE_PROFILE_VALUE, profileName, storageName, key, value),
    
    loadGlobalValue: (storageName:string, key:string) => ipcRenderer.invoke(ipcping.LOAD_GLOBAL_VALUE, storageName, key),
    storeGlobalValue: (storageName:string, key:string, value:any) => ipcRenderer.invoke(ipcping.STORE_GLOBAL_VALUE, storageName, key, value),
    
    loadProfileHistoryCount: (profileName:string, historyName:string) => ipcRenderer.invoke(ipcping.LOAD_PROFILE_HISTORY_COUNT, profileName, historyName),
    loadProfileHistory: (profileName:string, historyName:string, offset:number, limit:number) => ipcRenderer.invoke(ipcping.LOAD_PROFILE_HISTORY, profileName, historyName, offset, limit),
    storeProfileHistory: (profileName:string, historyName:string, data:any) => ipcRenderer.invoke(ipcping.STORE_PROFILE_HISTORY, profileName, historyName, data),
    deleteProfileHistory: (profileName:string, historyName:string, id:number) => ipcRenderer.invoke(ipcping.DELETE_PROFILE_HISTORY, profileName, historyName, id),
    deleteAllProfileHistory: (profileName:string, historyName:string) => ipcRenderer.invoke(ipcping.DELETE_ALL_PROFILE_HISTORY, profileName, historyName),

    setLastProfileName: (profileName:string) => ipcRenderer.invoke(ipcping.SET_LAST_PROFILE_NAME, profileName),
    getLastProfileName: () => ipcRenderer.invoke(ipcping.GET_LAST_PROFILE_NAME),

    writeLog: (name:string, message:string, showDatetime:boolean) => ipcRenderer.invoke(ipcping.WRITE_LOG, name, message, showDatetime),
};


contextBridge.exposeInMainWorld('electron', api);
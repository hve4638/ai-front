"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const ipc_1 = require("./ipc");
const api = {
    echo: (message) => electron_1.ipcRenderer.invoke(ipc_1.ipcping.ECHO, message),
    openBrowser: (url) => electron_1.ipcRenderer.invoke(ipc_1.ipcping.OPEN_BROWSER, url),
    openPromptDirectory: (profileName) => electron_1.ipcRenderer.invoke(ipc_1.ipcping.OPEN_PROMPT_DIRECTORY, profileName),
    fetch: (url, init) => electron_1.ipcRenderer.invoke(ipc_1.ipcping.FETCH, url, init),
    abortFetch: (fetchID) => electron_1.ipcRenderer.invoke(ipc_1.ipcping.ABORT_FETCH, fetchID),
    getFetchResponse: (fetchID) => electron_1.ipcRenderer.invoke(ipc_1.ipcping.GET_FETCH_RESPONSE, fetchID),
    loadRootPromptMetadata: (profileName) => electron_1.ipcRenderer.invoke(ipc_1.ipcping.LOAD_ROOT_PROMPT_METADATA, profileName),
    loadModulePromptMetadata: (profileName, moduleName) => electron_1.ipcRenderer.invoke(ipc_1.ipcping.LOAD_MODULE_PROMPT_METADATA, profileName, moduleName),
    loadPromptTemplate: (profileName, moduleName, filename) => electron_1.ipcRenderer.invoke(ipc_1.ipcping.LOAD_PROMPT_TEMPLATE, profileName, moduleName, filename),
    getProfileNames: () => electron_1.ipcRenderer.invoke(ipc_1.ipcping.GET_PROFILE_NAMES),
    createProfile: (profileName) => electron_1.ipcRenderer.invoke(ipc_1.ipcping.CREATE_PROFILE, profileName),
    deleteProfile: (profileName) => electron_1.ipcRenderer.invoke(ipc_1.ipcping.DELETE_PROFILE, profileName),
    loadProfileValue: (profileName, storageName, key) => electron_1.ipcRenderer.invoke(ipc_1.ipcping.LOAD_PROFILE_VALUE, profileName, storageName, key),
    storeProfileValue: (profileName, storageName, key, value) => electron_1.ipcRenderer.invoke(ipc_1.ipcping.STORE_PROFILE_VALUE, profileName, storageName, key, value),
    loadProfileHistoryCount: (profileName, historyName) => electron_1.ipcRenderer.invoke(ipc_1.ipcping.LOAD_PROFILE_HISTORY_COUNT, profileName, historyName),
    loadProfileHistory: (profileName, historyName, offset, limit) => electron_1.ipcRenderer.invoke(ipc_1.ipcping.LOAD_PROFILE_HISTORY, profileName, historyName, offset, limit),
    storeProfileHistory: (profileName, historyName, data) => electron_1.ipcRenderer.invoke(ipc_1.ipcping.STORE_PROFILE_HISTORY, profileName, historyName, data),
    deleteProfileHistory: (profileName, historyName, id) => electron_1.ipcRenderer.invoke(ipc_1.ipcping.DELETE_PROFILE_HISTORY, profileName, historyName, id),
    deleteAllProfileHistory: (profileName, historyName) => electron_1.ipcRenderer.invoke(ipc_1.ipcping.DELETE_ALL_PROFILE_HISTORY, profileName, historyName),
    setLastProfileName: (profileName) => electron_1.ipcRenderer.invoke(ipc_1.ipcping.SET_LAST_PROFILE_NAME, profileName),
    getLastProfileName: () => electron_1.ipcRenderer.invoke(ipc_1.ipcping.GET_LAST_PROFILE_NAME),
    writeLog: (name, message, showDatetime) => electron_1.ipcRenderer.invoke(ipc_1.ipcping.WRITE_LOG, name, message, showDatetime),
};
electron_1.contextBridge.exposeInMainWorld('electron', api);

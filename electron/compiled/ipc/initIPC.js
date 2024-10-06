"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initIPC = initIPC;
const electron_1 = require("electron");
const ipcping_1 = __importDefault(require("./ipcping"));
const ipcHandler_1 = require("./ipcHandler");
function ipcHandle(ping, callback) {
    electron_1.ipcMain.handle(ping, (event, ...args) => {
        try {
            const result = callback(...args);
            return result;
        }
        catch (error) {
            return [makeErrorStruct(error)];
        }
    });
}
function makeErrorStruct(error) {
    try {
        return {
            name: error.name,
            message: error.message,
        };
    }
    catch (error) {
        return {
            name: 'UnknownError',
            message: 'Unknown error',
        };
    }
}
function initIPC(dependencies) {
    const handlers = (0, ipcHandler_1.getIPCHandler)(dependencies);
    ipcHandle(ipcping_1.default.ECHO, handlers.echo);
    ipcHandle(ipcping_1.default.OPEN_BROWSER, handlers.openBrowser);
    ipcHandle(ipcping_1.default.OPEN_PROMPT_DIRECTORY, handlers.openPromptDirectory);
    ipcHandle(ipcping_1.default.FETCH, handlers.fetch);
    ipcHandle(ipcping_1.default.ABORT_FETCH, handlers.abortFetch);
    ipcHandle(ipcping_1.default.GET_FETCH_RESPONSE, handlers.getFetchResponse);
    ipcHandle(ipcping_1.default.LOAD_ROOT_PROMPT_METADATA, handlers.loadRootPromptMetadata);
    ipcHandle(ipcping_1.default.LOAD_MODULE_PROMPT_METADATA, handlers.loadModulePromptMetadata);
    ipcHandle(ipcping_1.default.LOAD_PROMPT_TEMPLATE, handlers.loadPromptTemplate);
    ipcHandle(ipcping_1.default.GET_PROFILE_NAMES, handlers.getProfileNames);
    ipcHandle(ipcping_1.default.CREATE_PROFILE, handlers.createProfile);
    ipcHandle(ipcping_1.default.DELETE_PROFILE, handlers.deleteProfile);
    ipcHandle(ipcping_1.default.LOAD_PROFILE_VALUE, handlers.loadProfileValue);
    ipcHandle(ipcping_1.default.STORE_PROFILE_VALUE, handlers.storeProfileValue);
    ipcHandle(ipcping_1.default.LOAD_PROFILE_HISTORY_COUNT, handlers.loadProfileHistoryCount);
    ipcHandle(ipcping_1.default.LOAD_PROFILE_HISTORY, handlers.loadProfileHistory);
    ipcHandle(ipcping_1.default.STORE_PROFILE_HISTORY, handlers.storeProfileHistory);
    ipcHandle(ipcping_1.default.DELETE_PROFILE_HISTORY, handlers.deleteProfileHistory);
    ipcHandle(ipcping_1.default.DELETE_ALL_PROFILE_HISTORY, handlers.deleteAllProfileHistory);
    ipcHandle(ipcping_1.default.SET_LAST_PROFILE_NAME, handlers.setLastProfileName);
    ipcHandle(ipcping_1.default.GET_LAST_PROFILE_NAME, handlers.getLastProfileName);
    ipcHandle(ipcping_1.default.WRITE_LOG, handlers.writeLog);
}

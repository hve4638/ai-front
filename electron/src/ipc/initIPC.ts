import { ipcMain } from 'electron';
import ipcping from './ipcping';
import { getIPCHandler } from './ipcHandler';
import type { IPCDependencies } from './ipcHandler';

type PINGS = typeof ipcping[keyof typeof ipcping];

export function initIPC(dependencies: IPCDependencies) {
    const handlers = getIPCHandler(dependencies);

    handleIPC(ipcping.ECHO, handlers.echo);
    handleIPC(ipcping.OPEN_BROWSER, handlers.openBrowser);
    handleIPC(ipcping.GET_CHATAI_MODELS, handlers.getChatAIModels);

    /* 마스터 키 */
    handleIPC(ipcping.INIT_MASTER_KEY, handlers.initMasterKey);
    handleIPC(ipcping.IS_MASTER_KEY_EXISTS, handlers.isMasterKeyExists);
    handleIPC(ipcping.VALIDATE_MASTER_KEY, handlers.validateMasterKey);
    handleIPC(ipcping.RESET_MASTER_KEY, handlers.resetMasterKey);
    handleIPC(ipcping.RECOVER_MASTER_KEY, handlers.recoverMasterKey);

    /* 전역 스토리지 */
    handleIPC(ipcping.GET_GLOBAL_DATA, handlers.getGlobalData);
    handleIPC(ipcping.SET_GLOBAL_DATA, handlers.setGlobalData);

    /* 프로필 */
    handleIPC(ipcping.CREATE_PROFILE, handlers.createProfile);
    handleIPC(ipcping.DELETE_PROFILE, handlers.deleteProfile);

    /* 프로필 목록 */
    handleIPC(ipcping.GET_PROFILE_LIST, handlers.getProfileList);
    handleIPC(ipcping.SET_LAST_PROFILE, handlers.setLastProfile);
    handleIPC(ipcping.GET_LAST_PROFILE, handlers.getLastProfile);

    /* 프로필 저장소 */
    handleIPC(ipcping.GET_PROFILE_DATA, handlers.getProfileData);
    handleIPC(ipcping.SET_PROFILE_DATA, handlers.setProfileData);
    handleIPC(ipcping.GET_PROFILE_DATA_AS_TEXT, handlers.getProfileDataAsText);
    handleIPC(ipcping.SET_PROFILE_DATA_AS_TEXT, handlers.setProfileDataAsText);
    handleIPC(ipcping.GET_PROFILE_DATA_AS_BINARY, handlers.getProfileDataAsBinary);
    handleIPC(ipcping.SET_PROFILE_DATA_AS_BINARY, handlers.setProfileDataAsBinary);

    /* 프로필 세션 */
    handleIPC(ipcping.ADD_PROFILE_SESSION, handlers.addProfileSession);
    handleIPC(ipcping.REMOVE_PROFILE_SESSION, handlers.removeProfileSession);
    handleIPC(ipcping.REORDER_PROFILE_SESSIONS, handlers.reorderProfileSessions);
    handleIPC(ipcping.GET_PROFILE_SESSION_IDS, handlers.getProfileSessionIds);
    handleIPC(ipcping.UNDO_REMOVE_PROFILE_SESSION, handlers.undoRemoveProfileSession);

    /* 프로필 세션 저장소 */
    handleIPC(ipcping.GET_PROFILE_SESSION_DATA, handlers.getProfileSessionData);
    handleIPC(ipcping.SET_PROFILE_SESSION_DATA, handlers.setProfileSessionData);

    /* 프로필 세션 히스토리 */
    handleIPC(ipcping.GET_PROFILE_SESSION_HISTORY, handlers.getProfileSessionHistory);
    handleIPC(ipcping.ADD_PROFILE_SESSION_HISTORY, handlers.addProfileSessionHistory);
    handleIPC(ipcping.DELETE_PROFILE_SESSION_HISTORY, handlers.deleteProfileSessionHistory);
    handleIPC(ipcping.DELETE_ALL_PROFILE_SESSION_HISTORY, handlers.deleteAllProfileSessionHistory);
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
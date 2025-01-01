import { contextBridge, ipcRenderer } from 'electron';
import { ipcping } from './ipc';

const api: IPC_TYPES = {
    echo: (message: string) => ipcRenderer.invoke(ipcping.ECHO, message),
    openBrowser: (url: string) => ipcRenderer.invoke(ipcping.OPEN_BROWSER, url),
    getChatAIModels: () => ipcRenderer.invoke(ipcping.GET_CHATAI_MODELS),

    /* 마스터 키 */
    initMasterKey: () => ipcRenderer.invoke(ipcping.INIT_MASTER_KEY),
    isMasterKeyExists: () => ipcRenderer.invoke(ipcping.IS_MASTER_KEY_EXISTS),
    validateMasterKey: () => ipcRenderer.invoke(ipcping.VALIDATE_MASTER_KEY),
    generateMasterKey: (recoveryKey: string) => ipcRenderer.invoke(ipcping.GENERATE_MASTER_KEY, recoveryKey),
    resetMasterKey: () => ipcRenderer.invoke(ipcping.RESET_MASTER_KEY),
    recoverMasterKey: (recoveryKey: string) => ipcRenderer.invoke(ipcping.RECOVER_MASTER_KEY, recoveryKey),

    /* 전역 저장소 */
    getGlobalData: (storageName: string, key: string) => ipcRenderer.invoke(ipcping.GET_GLOBAL_DATA, storageName, key),
    setGlobalData: (storageName: string, key: string, value: any) => ipcRenderer.invoke(ipcping.SET_GLOBAL_DATA, storageName, key, value),

    /* 프로필 */
    createProfile: () => ipcRenderer.invoke(ipcping.CREATE_PROFILE),
    deleteProfile: (profileName: string) => ipcRenderer.invoke(ipcping.DELETE_PROFILE, profileName),

    /* 프로필 목록 */
    getProfileList: () => ipcRenderer.invoke(ipcping.GET_PROFILE_LIST),
    getLastProfile: () => ipcRenderer.invoke(ipcping.GET_LAST_PROFILE),
    setLastProfile: (id: string | null) => ipcRenderer.invoke(ipcping.SET_LAST_PROFILE, id),

    /* 프로필 저장소 */
    getProfileData: (profileId: string, accessor: string, key: string) => ipcRenderer.invoke(ipcping.GET_PROFILE_DATA, profileId, accessor, key),
    setProfileData: (profileId: string, accessor: string, key: string, value: any) => ipcRenderer.invoke(ipcping.SET_PROFILE_DATA, profileId, accessor, key, value),
    getProfileDataAsText: (profileId: string, accessor: string) => ipcRenderer.invoke(ipcping.GET_PROFILE_DATA_AS_TEXT, profileId, accessor),
    setProfileDataAsText: (profileId: string, accessor: string, value: any) => ipcRenderer.invoke(ipcping.SET_PROFILE_DATA_AS_TEXT, profileId, accessor, value),
    getProfileDataAsBinary: (profileId: string, accessor: string) => ipcRenderer.invoke(ipcping.GET_PROFILE_DATA_AS_BINARY, profileId, accessor),
    setProfileDataAsBinary: (profileId: string, accessor: string, content: Buffer) => ipcRenderer.invoke(ipcping.SET_PROFILE_DATA_AS_BINARY, profileId, accessor, content),

    /* 프로필 세션 */
    addProfileSession: (profileId: string) => ipcRenderer.invoke(ipcping.ADD_PROFILE_SESSION, profileId),
    removeProfileSession: (profileId: string, sessionId: string) => ipcRenderer.invoke(ipcping.REMOVE_PROFILE_SESSION, profileId, sessionId),
    reorderProfileSessions: (profileId: string, sessionIds: string[]) => ipcRenderer.invoke(ipcping.REORDER_PROFILE_SESSIONS, profileId, sessionIds),
    getProfileSessionIds: (profileId: string) => ipcRenderer.invoke(ipcping.GET_PROFILE_SESSION_IDS, profileId),
    undoRemoveProfileSession : (profileId: string) => ipcRenderer.invoke(ipcping.UNDO_REMOVE_PROFILE_SESSION, profileId),
    
    /* 프로필 세션 저장소 */
    getProfileSessionData: (profileId: string, sessionId: string, accessor: string, key: string) => ipcRenderer.invoke(ipcping.GET_PROFILE_SESSION_DATA, profileId, sessionId, accessor, key),
    setProfileSessionData: (profileId: string, sessionId: string, accessor: string, key: string, value: any) => ipcRenderer.invoke(ipcping.SET_PROFILE_SESSION_DATA, profileId, sessionId, accessor, key, value),

    /* 프로필 세션 히스토리 */
    getProfileSessionHistory: (profileId: string, sessionId: string, condition: HistoryCondition) => ipcRenderer.invoke(ipcping.GET_PROFILE_SESSION_HISTORY, profileId, sessionId, condition),
    addProfileSessionHistory: (profileId: string, sessionId: string, history: any) => ipcRenderer.invoke(ipcping.ADD_PROFILE_SESSION_HISTORY, profileId, sessionId, history),
    deleteProfileSessionHistory: (profileId: string, sessionId: string, historyKey: number) => ipcRenderer.invoke(ipcping.DELETE_PROFILE_SESSION_HISTORY, profileId, sessionId, historyKey),
    deleteAllProfileSessionHistory: (profileId: string, sessionId: string) => ipcRenderer.invoke(ipcping.DELETE_ALL_PROFILE_SESSION_HISTORY, profileId, sessionId),
};


contextBridge.exposeInMainWorld('electron', api);
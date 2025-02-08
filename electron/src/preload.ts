import { contextBridge, ipcRenderer } from 'electron';
import { ipcping } from './ipc';
import PINGS from './ipc/ipcping';

type IPC_INTERFACE_NAMES = {
    [K in keyof IPC_TYPES]: PINGS;
};
const ipcInvokes:IPC_INTERFACE_NAMES = {
    echo : ipcping.ECHO,
    openBrowser : ipcping.OPEN_BROWSER,
    getChatAIModels : ipcping.GET_CHATAI_MODELS,
    
    /* 마스터 키 */
    initMasterKey : ipcping.INIT_MASTER_KEY,
    isMasterKeyExists : ipcping.IS_MASTER_KEY_EXISTS,
    validateMasterKey : ipcping.VALIDATE_MASTER_KEY,
    generateMasterKey : ipcping.GENERATE_MASTER_KEY,
    resetMasterKey : ipcping.RESET_MASTER_KEY,
    recoverMasterKey : ipcping.RECOVER_MASTER_KEY,

    /* 전역 저장소 */
    getGlobalData : ipcping.GET_GLOBAL_DATA,
    setGlobalData : ipcping.SET_GLOBAL_DATA,

    /* 프로필 */
    createProfile : ipcping.CREATE_PROFILE,
    deleteProfile : ipcping.DELETE_PROFILE,

    /* 프로필 목록 */
    getProfileList : ipcping.GET_PROFILE_LIST,
    getLastProfile : ipcping.GET_LAST_PROFILE,
    setLastProfile : ipcping.SET_LAST_PROFILE,

    /* 프로필 저장소 */
    getProfileData : ipcping.GET_PROFILE_DATA,
    setProfileData : ipcping.SET_PROFILE_DATA,
    getProfileDataAsText : ipcping.GET_PROFILE_DATA_AS_TEXT,
    setProfileDataAsText : ipcping.SET_PROFILE_DATA_AS_TEXT,
    getProfileDataAsBinary : ipcping.GET_PROFILE_DATA_AS_BINARY,
    setProfileDataAsBinary : ipcping.SET_PROFILE_DATA_AS_BINARY,
    
    /* 프로필 요청 템플릿 */
    getProfileRTTree : ipcping.GET_PROFILE_RT_TREE,
    updateProfileRTTree : ipcping.UPDATE_PROFILE_RT_TREE,
    addProfileRT : ipcping.ADD_PROFILE_RT,
    removeProfileRT : ipcping.REMOVE_PROFILE_RT,
    getProfileRTMode : ipcping.GET_PROFILE_RT_MODE,
    setProfileRTMode : ipcping.SET_PROFILE_RT_MODE,
    getProfileRTSimpleModeData : ipcping.GET_PROFILE_RT_SIMPLE_MODE_DATA,
    setProfileRTSimpleModeData : ipcping.SET_PROFILE_RT_SIMPLE_MODE_DATA,
    hasProfileRTId : ipcping.HAS_PROFILE_RT_ID,
    generateProfileRTId : ipcping.GENERATE_PROFILE_RT_ID,
    changeProfileRTId : ipcping.CHANGE_PROFILE_RT_ID,

    /* 프로필 세션 */
    addProfileSession : ipcping.ADD_PROFILE_SESSION,
    removeProfileSession : ipcping.REMOVE_PROFILE_SESSION,
    reorderProfileSessions : ipcping.REORDER_PROFILE_SESSIONS,
    getProfileSessionIds : ipcping.GET_PROFILE_SESSION_IDS,
    undoRemoveProfileSession : ipcping.UNDO_REMOVE_PROFILE_SESSION,

    /* 프로필 세션 저장소 */
    getProfileSessionData : ipcping.GET_PROFILE_SESSION_DATA,
    setProfileSessionData : ipcping.SET_PROFILE_SESSION_DATA,

    /* 프로필 세션 히스토리 */
    getProfileSessionHistory : ipcping.GET_PROFILE_SESSION_HISTORY,
    addProfileSessionHistory : ipcping.ADD_PROFILE_SESSION_HISTORY,
    deleteProfileSessionHistory : ipcping.DELETE_PROFILE_SESSION_HISTORY,
    deleteAllProfileSessionHistory : ipcping.DELETE_ALL_PROFILE_SESSION_HISTORY,
}

const ipcExports = Object.fromEntries(
    Object.entries(ipcInvokes).map(([key, ping]) => [key, (...args: unknown[]) => ipcRenderer.invoke(ping, ...args)])
) as IPC_TYPES;

contextBridge.exposeInMainWorld('electron', ipcExports);
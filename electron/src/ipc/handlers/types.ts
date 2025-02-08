import PING from '@ipc/ipcping';

export type IPCHandlers = {
    [PING.ECHO]: (message:string) => ElectronResult<string>;
    [PING.OPEN_BROWSER]: (url:string) => ElectronNoResult;
    [PING.GET_CHATAI_MODELS]: () => ElectronResult<ChatAIModels>;

    /* 마스터 키 */
    [PING.INIT_MASTER_KEY]: () => ElectronNoResult;
    [PING.IS_MASTER_KEY_EXISTS]: () => ElectronResult<boolean>;
    [PING.VALIDATE_MASTER_KEY]: () => ElectronResult<boolean>;
    [PING.GENERATE_MASTER_KEY]: (recoveryKey:string) => ElectronNoResult;
    [PING.RESET_MASTER_KEY]: () => ElectronNoResult;
    [PING.RECOVER_MASTER_KEY]: (recoveryKey:string) => ElectronResult<boolean>;

    /* 전역 스토리지 */
    [PING.GET_GLOBAL_DATA]: (storageName:string, key:string) => ElectronResult<any>;
    [PING.SET_GLOBAL_DATA]: (storageName:string, key:string, value:any) => ElectronNoResult;

    /* 프로필 */
    [PING.CREATE_PROFILE]: () => ElectronResult<string>;
    [PING.DELETE_PROFILE]: (profileName:string) => ElectronNoResult;

    /* 프로필 목록 */
    [PING.GET_PROFILE_LIST]: () => ElectronResult<string[]>;
    [PING.GET_LAST_PROFILE]: () => ElectronResult<string|null>;
    [PING.SET_LAST_PROFILE]: (id:string|null) => ElectronNoResult;

    /* 프로필 저장소 */
    [PING.GET_PROFILE_DATA]: (profileId:string, accessor:string, key:string) => ElectronResult<any>;
    [PING.SET_PROFILE_DATA]: (profileId:string, accessor:string, key:string, value:any) => ElectronNoResult;
    [PING.GET_PROFILE_DATA_AS_TEXT]: (profileId:string, accessor:string) => ElectronResult<string>;
    [PING.SET_PROFILE_DATA_AS_TEXT]: (profileId:string, accessor:string, value:string) => ElectronNoResult;
    [PING.GET_PROFILE_DATA_AS_BINARY]: (profileId:string, accessor:string) => ElectronResult<Buffer>;
    [PING.SET_PROFILE_DATA_AS_BINARY]: (profileId:string, accessor:string, content:Buffer) => ElectronNoResult;

    /* 프로필 요청 템플릿 */
    [PING.GET_PROFILE_RT_TREE]: (profileId:string) => ElectronResult<RTMetadataTree>;
    [PING.UPDATE_PROFILE_RT_TREE]: (profileId:string, tree:RTMetadataTree) => ElectronNoResult;
    [PING.ADD_PROFILE_RT]: (profileId:string, rt:any) => ElectronNoResult;
    [PING.REMOVE_PROFILE_RT]: (profileId:string, rtId:string) => ElectronNoResult;
    [PING.GET_PROFILE_RT_MODE]: (profileId:string, rtId:string) => ElectronResult<RTMode>;
    [PING.SET_PROFILE_RT_MODE]: (profileId:string, rtId:string, mode:RTMode) => ElectronNoResult;
    [PING.GET_PROFILE_RT_SIMPLE_MODE_DATA]: (profileId:string, rtId:string) => ElectronResult<RTSimpleModeData>;
    [PING.SET_PROFILE_RT_SIMPLE_MODE_DATA]: (profileId:string, data:RTSimpleModeData) => ElectronNoResult;
    [PING.HAS_PROFILE_RT_ID]: (profileId:string, rtId:string) => ElectronResult<boolean>;
    [PING.GENERATE_PROFILE_RT_ID]: (profileId:string) => ElectronResult<string>;
    [PING.CHANGE_PROFILE_RT_ID]: (profileId:string, oldRTId:string, newRTId:string) => ElectronNoResult;

    /* 프로필 세션 */
    [PING.ADD_PROFILE_SESSION]: (profileId:string) => ElectronResult<string>;
    [PING.REMOVE_PROFILE_SESSION]: (profileId:string, sessionId:string) => ElectronNoResult;
    [PING.UNDO_REMOVE_PROFILE_SESSION]: (profileId:string) => ElectronResult<string>;
    [PING.REORDER_PROFILE_SESSIONS]: (profileId:string, sessions:string[]) => ElectronNoResult;
    [PING.GET_PROFILE_SESSION_IDS]: (profileId:string) => ElectronResult<string[]>;
    
    /* 프로필 세션 저장소 */
    [PING.GET_PROFILE_SESSION_DATA]: (profileId:string, sessionId:string, accessor:string, key:string) => ElectronResult<any>;
    [PING.SET_PROFILE_SESSION_DATA]: (profileId:string, sessionId:string, accessor:string, key:string, value:any) => ElectronNoResult;

    /* 프로필 세션 히스토리 */
    [PING.GET_PROFILE_SESSION_HISTORY]: (profileId:string, sessionId:string, condition:HistoryCondition) => ElectronResult<any>;
    [PING.ADD_PROFILE_SESSION_HISTORY]: (profileId:string, sessionId:string, history:any) => ElectronNoResult;
    [PING.DELETE_PROFILE_SESSION_HISTORY]: (profileId:string, sessionId:string, historyKey:number) => ElectronNoResult;
    [PING.DELETE_ALL_PROFILE_SESSION_HISTORY]: (profileId:string, sessionId:string) => ElectronNoResult;
}
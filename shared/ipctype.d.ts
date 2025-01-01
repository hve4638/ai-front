import './chatai-model';

type ElectronResultSync<T> = [Error|null, T];
type ElectronResult<T> = Promise<[Error]|[null, T]>;
type ElectronNoResult = Promise<[Error|null]>;

declare global {
    type HistoryCondition = {
        offset? : number;
        limit? : number;
        desc? : boolean;
        flag? : number;
        date_begin? : number;
        date_end? : number;
    }
    type IPC_TYPES = {
        echo: (message:string) => ElectronResult<string>;
        openBrowser: (url:string) => ElectronNoResult;
        getChatAIModels: () => ElectronResult<ChatAIModels>;

        /* 마스터 키 */
        initMasterKey: () => ElectronNoResult;
        isMasterKeyExists: () => ElectronResult<boolean>;
        validateMasterKey: () => ElectronResult<boolean>;
        generateMasterKey: (recoveryKey:string) => ElectronNoResult;
        resetMasterKey: () => ElectronNoResult;
        recoverMasterKey: (recoveryKey:string) => ElectronResult<boolean>;

        /* 전역 스토리지 */
        getGlobalData: (storageName:string, key:string) => ElectronResult<any>;
        setGlobalData: (storageName:string, key:string, value:any) => ElectronNoResult;

        /* 프로필 */
        createProfile: () => ElectronResult<string>;
        deleteProfile: (profileName:string) => ElectronNoResult;

        /* 프로필 목록 */
        getProfileList: () => ElectronResult<string[]>;
        getLastProfile: () => ElectronResult<string|null>;
        setLastProfile: (id:string|null) => ElectronNoResult;

        /* 프로필 저장소 */
        getProfileData: (profileId:string, accessor:string, key:string) => ElectronResult<any>;
        setProfileData: (profileId:string, accessor:string, key:string, value:any) => ElectronNoResult;
        getProfileDataAsText: (profileId:string, accessor:string) => ElectronResult<string>;
        setProfileDataAsText: (profileId:string, accessor:string, value:string) => ElectronNoResult;
        getProfileDataAsBinary: (profileId:string, accessor:string) => ElectronResult<Buffer>;
        setProfileDataAsBinary: (profileId:string, accessor:string, content:Buffer) => ElectronNoResult;


        /* 프로필 세션 */
        addProfileSession: (profileId:string) => ElectronResult<string>;
        removeProfileSession: (profileId:string, sessionId:string) => ElectronNoResult;
        undoRemoveProfileSession: (profileId:string) => ElectronResult<string>;
        reorderProfileSessions: (profileId:string, sessions:string[]) => ElectronNoResult;
        getProfileSessionIds: (profileId:string) => ElectronResult<string[]>;
        
        /* 프로필 세션 저장소 */
        getProfileSessionData: (profileId:string, sessionId:string, accessor:string, key:string) => ElectronResult<any>;
        setProfileSessionData: (profileId:string, sessionId:string, accessor:string, key:string, value:any) => ElectronNoResult;

        /* 프로필 세션 히스토리 */
        getProfileSessionHistory: (profileId:string, sessionId:string, condition:HistoryCondition) => ElectronResult<any>;
        addProfileSessionHistory: (profileId:string, sessionId:string, history:any) => ElectronNoResult;
        deleteProfileSessionHistory: (profileId:string, sessionId:string, historyKey:number) => ElectronNoResult;
        deleteAllProfileSessionHistory: (profileId:string, sessionId:string) => ElectronNoResult;
    };
}


export {};
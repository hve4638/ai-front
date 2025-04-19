/**
 * electron에서 ipcRenderer.invoke() 를 통해 front로 노출시킬 명령어
 * 
 * share/ipc-command.d.ts 와 electron/types/ipc.ts 는 동일하게 유지되어야 함
 */
export enum IPCInvokerName {
    Echo = 'Echo',
    OpenBrowser = 'OpenBrowser',
    GetChatAIModels = 'GetChatAIModels',
    
    /* 요청 수행 */
    FetchData = 'FetchData',
    AbortFetchRequest = 'AbortFetchRequest',
    GetFetchResponse = 'GetFetchResponse',

    /* 마스터 키 */
    InitMasterKey = 'InitMasterKey',
    ResetMasterKey = 'ResetMasterKey',
    RecoverMasterKey = 'RecoverMasterKey',

    /* 전역 스토리지 */
    GetGlobalData = 'GetGlobalData',
    SetGlobalData = 'SetGlobalData',

    /* 프로필 */
    CreateProfile = 'CreateProfile',
    DeleteProfile = 'DeleteProfile',

    /* 프로필 목록 */
    GetProfileList = 'GetProfileList',
    GetLastProfile = 'GetLastProfile',
    SetLastProfile = 'SetLastProfile',
    
    /* 프로필 저장소 */
    GetProfileData = 'GetProfileData',
    SetProfileData = 'SetProfileData',
    PushProfileDataToArray = 'PushProfileDataToArray',
    GetProfileDataAsText = 'GetProfileDataAsText',
    SetProfileDataAsText = 'SetProfileDataAsText',
    GetProfileDataAsBinary = 'GetProfileDataAsBinary',
    SetProfileDataAsBinary = 'SetProfileDataAsBinary',
    VerifyProfileDataAsSecret = 'VerifyProfileDataAsSecret',
    SetProfileDataAsSecret = 'SetProfileDataAsSecret',
    RemoveProfileDataAsSecret = 'RemoveProfileDataAsSecret',
    PushProfileDataToArrayAsSecret = 'PushProfileDataToArrayAsSecret',
    
    /* 프로필 프롬프트 */
    GetProfilePromptTree = 'GetProfilePromptTree',
    UpdateProfilePromptTree = 'UpdateProfilePromptTree',
    AddProfilePrompt = 'AddProfilePrompt',
    RemoveProfilePrompt = 'RemoveProfilePrompt',

    /* 프로필 세션 */
    AddProfileSession = 'AddProfileSession',
    RemoveProfileSession = 'RemoveProfileSession',
    GetProfileSessionIds = 'GetProfileSessionIds',
    ReorderProfileSessions = 'ReorderProfileSessions',
    UndoRemoveProfileSession = 'UndoRemoveProfileSession',

    /* 프로필 세션 저장소 */
    GetProfileSessionData = 'GetProfileSessionData',
    SetProfileSessionData = 'SetProfileSessionData',
    
    /* 프로필 세션 히스토리 */
    GetProfileSessionHistoryMetadata = 'GetProfileSessionHistoryMetadata',
    SearchProfileSessionHistoryMetadata = 'SearchProfileSessionHistoryMetadata',
    GetProfileSessionHistoryMessage = 'GetProfileSessionHistoryMessage',
    AddProfileSessionHistory = 'AddProfileSessionHistory',
    DeleteProfileSessionHistory = 'DeleteProfileSessionHistory',
    DeleteAllProfileSessionHistory = 'DeleteAllProfileSessionHistory',

    /* 프로필 RT */
    GetProfileRTTree = 'GetProfileRTTree',
    UpdateProfileRTTree = 'UpdateProfileRTTree',
    AddProfileRT = 'AddProfileRT',
    RemoveProfileRT = 'RemoveProfileRT',
    GetProfileRTMode = 'GetProfileRTMode',
    SetProfileRTMode = 'SetProfileRTMode',
    GetProfileRTPromptData = 'GetProfileRTPromptData',
    SetProfileRTPromptData = 'SetProfileRTPromptData',
    HasProfileRTId = 'HasProfileRTId',
    GenerateProfileRTId = 'GenerateProfileRTId',
    ChangeProfileRTId = 'ChangeProfileRTId',
    GetProfileRTData = 'GetProfileRTData',
    SetProfileRTData = 'SetProfileRTData',
    ReflectProfileRTMetadata = 'ReflectProfileRTMetadata',

    /* 프로필 RT 요청 */
    RequestProfileRT = 'RequestProfileRT',
    AbortProfileRTRequest = 'AbortProfileRTRequest',
}

export {};
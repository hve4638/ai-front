export enum IPCCommand {
    Echo = 'Echo',
    OpenBrowser = 'OpenBrowser',
    GetChatAIModels = 'GetChatAIModels',
    
    /* 요청 수행 */
    FetchData = 'FetchData',
    AbortFetchRequest = 'AbortFetchRequest',
    GetFetchResponse = 'GetFetchResponse',

    /* 마스터 키 */
    InitMasterKey = 'InitMasterKey',
    CheckMasterKeyExistence = 'CheckMasterKeyExistence',
    ValidateMasterKey = 'ValidateMasterKey',
    GenerateMasterKey = 'GenerateMasterKey',
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
    GetProfileDataAsText = 'GetProfileDataAsText',
    SetProfileDataAsText = 'SetProfileDataAsText',
    GetProfileDataAsBinary = 'GetProfileDataAsBinary',
    SetProfileDataAsBinary = 'SetProfileDataAsBinary',
    
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
    GetProfileSessionHistory = 'GetProfileSessionHistory',
    AddProfileSessionHistory = 'AddProfileSessionHistory',
    DeleteProfileSessionHistory = 'DeleteProfileSessionHistory',
    DeleteAllProfileSessionHistory = 'DeleteAllProfileSessionHistory',

    /* 프로필 요청 템플릿 */
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
}

export {};
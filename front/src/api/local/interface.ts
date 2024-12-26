export interface Promptlist {
    prompts:object[],
    vars:object[]
}

export interface ILocalAPI {
    echo: (message: string) => Promise<any>,
    openBrowser: (url: string) => Promise<any>,
    getChatAIModels: () => Promise<ChatAIModels>,

    /* 전역 저장소 */
    getGlobalData: (storageName: string, key: string) => Promise<any>,
    setGlobalData: (storageName: string, key: string, value: any) => Promise<any>,

    /* 프로필 */
    createProfile: () => Promise<any>,
    deleteProfile: (profileName: string) => Promise<any>,

    /* 프로필 목록 */
    getProfileList: () => Promise<string[]>,
    getLastProfile: () => Promise<string|null>,
    setLastProfile: (id: string | null) => Promise<void>,

    /* 프로필 저장소 */
    getProfileData: (profileId: string, accessor: string, key: string) => Promise<any>,
    setProfileData: (profileId: string, accessor: string, key: string, value: any) => Promise<any>,
    getProfileDataAsText: (profileId: string, accessor: string) => Promise<any>,
    setProfileDataAsText: (profileId: string, accessor: string, value: any) => Promise<any>,
    getProfileDataAsBinary: (profileId: string, accessor: string) => Promise<any>,
    setProfileDataAsBinary: (profileId: string, accessor: string, content: Buffer) => Promise<any>,

    /* 프로필 세션 */
    addProfileSession: (profileId: string) => Promise<string>,
    removeProfileSession: (profileId: string, sessionId: string) => Promise<void>,
    getProfileSessionIds: (profileId: string) => Promise<string[]>,
    reorderProfileSessions: (profileId: string, tabs: string[]) => Promise<void>,
    undoRemoveProfileSession: (profileId: string) => Promise<string|null>,

    /* 프로필 저장소 */
    getProfileSessionData: (profileId: string, sessionId: string, accessor: string, key: string) => Promise<any>,
    setProfileSessionData: (profileId: string, sessionId: string, accessor: string, key: string, value: any) => Promise<void>,

    getProfileSessionHistory: (profileId: string, sessionId: string, condition: HistoryCondition) => Promise<any>,
    addProfileSessionHistory: (profileId: string, sessionId: string, history: any) => Promise<any>,
    deleteProfileSessionHistory: (profileId: string, sessionId: string, historyKey: number) => Promise<any>,
    deleteAllProfileSessionHistory: (profileId: string, sessionId: string) => Promise<any>,

}
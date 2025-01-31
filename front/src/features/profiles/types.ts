export type ProfileMetadata = {
    name: string;
    color: string;
    icon?: any;
}

export interface IProfiles {
    getProfileIds(): Promise<string[]>;
    getLastProfile(): Promise<string | null>;
    setLastProfile(id: string | null): void;
    createProfile(): Promise<string>;
    getProfile(id: string): Promise<IProfile>;
    deleteProfile(id: string): void;
}

export interface IProfile {
    loadMetadata(): Promise<void>;
    setData(accessor:string, key: string, value: any): Promise<void>;
    getData(accessor:string, key: string): Promise<any>;

    /* 세션 */
    getSession(sessionId:string): IProfileSession;

    createSession(): Promise<string>;
    removeSession(sessionId: string): Promise<void>;
    reorderSessions(sessions: string[]): Promise<void>;
    getSessionIds(): Promise<string[]>;
    undoRemoveSession(): Promise<string | null>;

    /* 요청 템플릿 */
    getRTTree(): Promise<RTMetadataTree>;
    updateRTTree(tree:RTMetadataTree): Promise<void>;
    createRTId(): Promise<string>;
    changeRTId(oldId: string, newId: string): Promise<void>;
    hasRTId(id: string): Promise<boolean>;

    get name(): string;
    get color(): string;
    set name(value: string);
    set color(value: string);
}

export interface IProfileSession {
    getData(accessor:string, key: string): Promise<any>;
    setData(accessor:string, key: string, value: any): Promise<void>;

    get id(): string;
}
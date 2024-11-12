type ElectronResultSync<T> = [Error|null, T];
type ElectronResult<T> = Promise<[Error|null, T]>;
type ElectronNoResult = Promise<[Error|null]>;

type IPC_TYPES = {
    /** 메시지 전송 */
    echo: (message:string) => ElectronResult<string>;
    /** 브라우저 열기 */
    openBrowser: (url:string) => ElectronNoResult;
    /** 프롬프트 디렉토리 열기 */
    openPromptDirectory: (profileName:string) => ElectronNoResult;
    

    /** 요청 후 fetchId 토큰 리턴 */
    fetch: (url:string, init:Object) => ElectronResult<number>;
    /** 요청 취소 */
    abortFetch: (fetchID:number) => ElectronNoResult;
    /** 요청 결과를 가져옴 */
    getFetchResponse : (fetchID:number) => ElectronResult<any>;

    /** 특정 Profile의 Root 프롬프트 메타데이터를 가져옴 */
    loadRootPromptMetadata : (profileName:string) => ElectronResult<string>;
    /** 특정 Profile의 Module 프롬프트 메타데이터를 가져옴 */
    loadModulePromptMetadata : (profileName:string, moduleName:string) => ElectronResult<string>;
    /** 특정 Profile의 프롬프트 템플릿을 가져옴 */
    loadPromptTemplate: (profileName:string, moduleName:string, filename:string) => ElectronResult<string>;

    /** Global 목록을 가져옴 */
    loadGlobalValue: (storageName:string, key:string) => ElectronResult<any>;
    /** Global에 값을 저장 */
    storeGlobalValue: (storageName:string, key:string, value:any) => ElectronNoResult;

    /** Profile 목록을 가져옴 */
    getProfileNames: () => ElectronResult<string[]>;
    /** Profile 생성 */
    createProfile: (profileName:string) => ElectronNoResult;
    /** Profile 삭제 */
    deleteProfile: (profileName:string) => ElectronNoResult;

    /** 특정 Profile의 Storage의 값을 가져옴 */
    loadProfileValue: (profileName:string, storageName:string, key:string) => ElectronResult<any>;
    /** 특정 Profile의 Storage에 값을 저장 */
    storeProfileValue: (profileName:string, storageName:string, key:string, value:any) => ElectronNoResult;

    /** 특정 Profile History 개수를 가져옴 */
    loadProfileHistoryCount: (profileName:string, historyName:string) => ElectronResult<number>;
    /** 특정 Profile History의 데이터 가져옴 */
    loadProfileHistory: (profileName:string, historyName:string, offset, limit) => ElectronResult<any[]>;
    /** 특정 Profile History에 데이터 추가 */
    storeProfileHistory: (profileName:string, historyName:string, data:any) => ElectronNoResult;
    /** 특정 Profile History의 데이터 삭제 */
    deleteProfileHistory: (profileName:string, historyName:string, id:number) => ElectronNoResult;
    /** 특정 Profile History의 모든 데이터 삭제 */
    deleteAllProfileHistory: (profileName:string, historyName:string) => ElectronNoResult;

    /** 마지막으로 사용한 Profile 이름 설정 */
    setLastProfileName: (profileName:string) => ElectronNoResult;
    /** 마지막으로 사용한 Profile 이름을 가져옴 */
    getLastProfileName: () => ElectronResult<string|null>;

    /** 로그 작성 */
    writeLog: (name:string, message:string, showDatetime:boolean) => ElectronNoResult;
};
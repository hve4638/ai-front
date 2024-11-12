export interface Promptlist {
    prompts:object[],
    vars:object[]
}

export interface ILocalAPI {
    echo(message:string):Promise<string>;
    openBrowser(url:string):Promise<void>;
    openPromptDirectory(profileName:string):Promise<void>;
    fetch(url:string, init:any):Promise<number>;
    abortFetch(fetchId:number):Promise<void>;
    getFetchResponse(fetchId:number):Promise<any>;
    loadRootPromptMetadata(profileName:string):Promise<string>;
    loadModulePromptMetadata(profileName:string, moduleName:string):Promise<string>;
    loadPromptTemplate(profileName:string, basePath:string, filename:string):Promise<string>;
    loadGlobalValue(storageName:string, key:string):Promise<any>;
    storeGlobalValue(storageName:string, key:string, value:any):Promise<void>;
    getProfileNames():Promise<string[]>;
    createProfile(name:string):Promise<void>;
    deleteProfile(name:string):Promise<void>;
    loadProfileValue(profileName:string, filename:string, key:string):Promise<any>;
    storeProfileValue(profileName:string, filename:string, key:string, value:any):Promise<void>;
    loadProfileHistory(profileName:string, historyName:string, offset:number, limit:number):Promise<any>;
    storeProfileHistory(profileName:string, historyName:string, data:any):Promise<void>;
    deleteProfileHistory(profileName:string, historyName:string, id:number):Promise<void>;
    deleteAllProfileHistory(profileName:string, historyName:string):Promise<void>;
    getLastProfileName():Promise<string|null>;
    setLastProfileName(profileName:string):Promise<void>;
    writeLog(logName:string, message:string, showDatetime:boolean):Promise<void>;
}
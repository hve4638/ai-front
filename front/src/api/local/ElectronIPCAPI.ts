import type { ILocalAPI } from './interface';
const electron = window.electron;

class IPCError extends Error {
    constructor(message:string) {
        super(message);
        this.name = 'IPCError';
    }
}

class ElectronIPCAPI implements ILocalAPI {
    async echo(message:any) {
        const [_, data] = await electron.echo(message);
        return data;
    }

    async openBrowser(url:string) {
        await electron.openBrowser(url);
    }

    async openPromptDirectory(profileName:string) {
        await electron.openPromptDirectory(profileName);
    }

    async fetch(url:string, init:any):Promise<number> {
        const [err, id] = await electron.fetch(url, init);
        if (err) throw new IPCError(err.message);

        return id;
    }
    async abortFetch(fetchId:number) {
        const [err] = await electron.abortFetch(fetchId);

        if (err) throw new IPCError(err.message);
    }
    async getFetchResponse(fetchId:number):Promise<any> {
        const [err, result] = await electron.getFetchResponse(fetchId);
        if (err) throw new IPCError(err.message);

        return result; 
    }

     async loadRootPromptMetadata(profileName:string) {
        const [err, metadata] = await electron.loadRootPromptMetadata(profileName);
        if (err) throw new IPCError(err.message);

        return metadata;
    }
     async loadModulePromptMetadata(profileName:string, moduleName:string) {
        const [err, metadata] = await electron.loadModulePromptMetadata(profileName, moduleName);
        if (err) throw new IPCError(err.message);

        return metadata;
    }
     async loadPromptTemplate(profileName:string, basePath:string, filename:string) {
        const [err, contents] = await electron.loadPromptTemplate(profileName, basePath, filename);
        if (err) throw new IPCError(err.message);

        return contents;
    }

     async loadGlobalValue(storageName:string, key:string) {
        const [err, value] = await electron.loadGlobalValue(storageName, key);
        if (err) throw new IPCError(err.message);

        return value;
    }
     async storeGlobalValue(storageName:string, key:string, value:any) {
        const [err] = await electron.storeGlobalValue(storageName, key, value);
        if (err) throw new IPCError(err.message);
    }

     async getProfileNames():Promise<string[]> {
        const [err, names] = await electron.getProfileNames();
        if (err) throw new IPCError(err.message);

        return names;
    }
     async createProfile(name:string) {
        const [err] = await electron.createProfile(name);
        if (err) throw new IPCError(err.message);
    }
     async deleteProfile(name:string) {
        const [err] = await electron.deleteProfile(name);
        if (err) throw new IPCError(err.message);
    }

     async loadProfileValue(profileName:string, filename:string, key:string) {
        const [err, value] = await electron.loadProfileValue(profileName, filename, key);
        if (err) throw new IPCError(err.message);
        return value;
    }
     async storeProfileValue(profileName:string, filename:string, key:string, value:any) {
        const [err] = await electron.storeProfileValue(profileName, filename, key, value);
        if (err) throw new IPCError(err.message);
    }

     async loadProfileHistory(profileName:string, historyName:string, offset:number, limit:number) {
        const [err, history] = await electron.loadProfileHistory(profileName, historyName, offset, limit);
        if (err) throw new IPCError(err.message);
        return history;
    }

     async storeProfileHistory(profileName:string, historyName:string, data:any) {
        const [err] = await electron.storeProfileHistory(profileName, historyName, JSON.stringify(data));
        if (err) throw new IPCError(err.message);
    }

     async deleteProfileHistory(profileName:string, historyName:string, id:number) {
        const [err] = await electron.deleteProfileHistory(profileName, historyName, id);
        if (err) throw new IPCError(err.message);
    }

     async deleteAllProfileHistory(profileName:string, historyName:string) {
        const [err] = await electron.deleteAllProfileHistory(profileName, historyName);
        if (err) throw new IPCError(err.message);
    }

     async getLastProfileName():Promise<string|null> {
        const [err, name] = await electron.getLastProfileName();
        if (err) return null;

        return name;
    }

     async setLastProfileName(profileName:string) {
        const [err] = await electron.setLastProfileName(profileName);
        if (err) throw new IPCError(err.message);
    }

     async writeLog(logName:string, message:string, showDatetime:boolean) {
        const [err] = await electron.writeLog(logName, message, showDatetime);
        if (err) throw new IPCError(err.message);
    }
}

export default ElectronIPCAPI;
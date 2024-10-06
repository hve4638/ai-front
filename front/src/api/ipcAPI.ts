const electron = window.electron;

class IPCError extends Error {
    constructor(message:string) {
        super(message);
        this.name = 'IPCError';
    }
}

class IPCAPI {
    static async echo(message:any) {
        const [_, data] = await electron.echo(message);
        return data;
    }

    static async openBrowser(url:string) {
        await electron.openBrowser(url);
    }

    static async openPromptDirectory(profileName:string) {
        await electron.openPromptDirectory(profileName);
    }

    static async fetch(url:string, init:any):Promise<number> {
        const [err, id] = await electron.fetch(url, init);
        if (err) throw new IPCError(err.message);

        return id;
    }

    static async abortFetch(fetchId:number) {
        const [err] = await electron.abortFetch(fetchId);

        if (err) throw new IPCError(err.message);
    }

    static async getFetchResponse(fetchId:number):Promise<any> {
        const [err, result] = await electron.getFetchResponse(fetchId);

        if (err) throw new IPCError(err.message);

        return result; 
    }

    static async loadRootPromptMetadata(profileName:string) {
        const [err, metadata] = await electron.loadRootPromptMetadata(profileName);
        if (err) throw new IPCError(err.message);

        return metadata;
    }

    static async loadModulePromptMetadata(profileName:string, moduleName:string) {
        const [err, metadata] = await electron.loadModulePromptMetadata(profileName, moduleName);
        if (err) throw new IPCError(err.message);

        return metadata;
    }

    static async loadPromptTemplate(profileName:string, basePath:string, filename:string) {
        const [err, contents] = await electron.loadPromptTemplate(profileName, basePath, filename);
        if (err) throw new IPCError(err.message);

        return contents;
    }

    static async getProfileNames():Promise<string[]> {
        const [err, names] = await electron.getProfileNames();
        if (err) throw new IPCError(err.message);

        return names;
    }
    static async createProfile(name:string) {
        const [err] = await electron.createProfile(name);
        if (err) throw new IPCError(err.message);
    }
    static async deleteProfile(name:string) {
        const [err] = await electron.deleteProfile(name);
        if (err) throw new IPCError(err.message);
    }

    static async loadProfileValue(profileName:string, filename:string, key:string) {
        const data = await electron.loadProfileValue(profileName, filename, key);
        console.log(data);
        const [err, value] = data;
        if (err) throw new IPCError(err.message);
        console.log(value);
        return value;
    }
    static async storeProfileValue(profileName:string, filename:string, key:string, value:any) {
        const [err] = await electron.storeProfileValue(profileName, filename, key, value);
        if (err) throw new IPCError(err.message);
    }

    static async loadProfileHistory(profileName:string, historyName:string, offset:number, limit:number) {
        const [err, history] = await electron.loadProfileHistory(profileName, historyName, offset, limit);
        if (err) throw new IPCError(err.message);
        return history;
    }

    static async storeProfileHistory(profileName:string, historyName:string, data:any) {
        const [err] = await electron.storeProfileHistory(profileName, historyName, JSON.stringify(data));
        if (err) throw new IPCError(err.message);
    }

    static async deleteProfileHistory(profileName:string, historyName:string, id:number) {
        const [err] = await electron.deleteProfileHistory(profileName, historyName, id);
        if (err) throw new IPCError(err.message);
    }

    static async deleteAllProfileHistory(profileName:string, historyName:string) {
        const [err] = await electron.deleteAllProfileHistory(profileName, historyName);
        if (err) throw new IPCError(err.message);
    }

    static async getLastProfileName():Promise<string|null> {
        const [err, name] = await electron.getLastProfileName();
        if (err) return null;

        return name;
    }

    static async setLastProfileName(name:string) {
        const [err] = await electron.setLastProfileName(name);
        if (err) throw new IPCError(err.message);
    }

    static async writeLog(logName:string, message:string, showDatetime:boolean) {
        const [err] = await electron.writeLog(logName, message, showDatetime);
        if (err) throw new IPCError(err.message);
    }
}

export default IPCAPI;
import { RawPromptMetadataTree } from 'features/prompts';
import { Promptlist } from './interface';
import { deleteAllProfileHistory } from '../../../electron/ipcAPI';

const electron: any = window.electron;

class IPCError extends Error {
    constructor(message:string) {
        super(message);
        this.name = 'IPCError';
    }
}

export class IPCInteractive {
    static echo(message:any):any {
        const [_, data] = electron.echo(message);
        return data;
    }

    static openBrowser(url:string) {
        electron.openBrowser(url);
    }

    static openPromptDirectory() {
        electron.openPromptDirectory();
    }

    /**
     * @returns FetchId
     */
    static fetch(url:string, init:any):number {
        const [err, id] = electron.fetch(url, init);
        if (err) throw new IPCError(err.message);

        return id;
    }

    static abortFetch(fetchId:number) {
        const [err] = electron.abortFetch(fetchId);

        if (err) throw new IPCError(err.message);
    }

    static async getFetchResponse(fetchId:number):Promise<any> {
        const [err, result] = await electron.getFetchResponse(fetchId);

        if (err) throw new IPCError(err.message);

        return result;
    }

    static loadRootPromptMetadata(profileName:string) {
        return electron.loadRootPromptMetadata(profileName);
    }

    static loadModulePromptMetadata(profileName:string, moduleName:string) {
        return electron.loadModulePromptMetadata(profileName, moduleName);
    }

    static loadPromptTemplate(profileName:string, basePath:string, filename:string) {
        return electron.loadPromptTemplate(profileName, basePath, filename);
    }

    static getProfileNames():string[] {
        const [err, names] = electron.getProfileNames();
        if (err) throw new IPCError(err.message);

        return names;
    }

    static createProfile(name:string) {
        const [err] = electron.createProfile(name);
        if (err) throw new IPCError(err.message);
    }
    static deleteProfile(name:string) {
        const [err] = electron.deleteProfile(name);
        if (err) throw new IPCError(err.message);
    }

    static loadProfileValue(profileName:string, filename:string, key:string) {
        const [err, value] = electron.loadProfileValue(profileName, filename, key);
        if (err) throw new IPCError(err.message);

        return value;
    }
    static storeProfileValue(profileName:string, filename:string, key:string, value:any) {
        const [err] = electron.storeProfileValue(profileName, filename, key, value);
        if (err) throw new IPCError(err.message);
    }

    static loadProfileHistory(profileName:string, historyName:string, offset:number, limit:number) {
        const [err, history] = electron.loadProfileHistory(profileName, historyName, offset, limit);
        if (err) throw new IPCError(err.message);
        return history;
    }

    static storeProfileHistory(profileName:string, historyName:string, data:any) {
        const [err] = electron.storeProfileHistory(profileName, historyName, JSON.stringify(data));
        if (err) throw new IPCError(err.message);
    }

    static deleteProfileHistory(profileName:string, historyName:string, id:number) {
        const [err] = electron.deleteProfileHistory(profileName, historyName, id);
        if (err) throw new IPCError(err.message);
    }

    static deleteAllProfileHistory(profileName:string, historyName:string) {
        const [err] = electron.deleteAllProfileHistory(profileName, historyName);
        if (err) throw new IPCError(err.message);
    }
    
    /**
     * @deprecated
     */
    static logEvent(eventName: string, data: { [key: string]: any }) {
        console.log(eventName, data);
    }
}
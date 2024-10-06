import { TARGET_ENV, VERSION } from 'data/constants'
import IPCAPI from './ipcAPI';
import { NotImplementedError } from 'features/errors';

const errorNotAvailable = () => new Error('This feature is not available on this platform.');

const TARGET_API:typeof IPCAPI = IPCAPI;

class LocalAPI {
    static async echo(message:any) {
        await TARGET_API.echo(message);
    }

    static async openBrowser(url:string) {
        await TARGET_API.openBrowser(url);
    }

    static async openPromptDirectory(profileName:string) {
        await TARGET_API.openPromptDirectory(profileName);
    }

    static async fetch(url:string, init:any):Promise<number> {
        return await IPCAPI.fetch(url, init);
    }
    static async abortFetch(fetchId:number) {
        await IPCAPI.abortFetch(fetchId);
    }
    static async getFetchResponse(fetchId:number):Promise<any> {
        return await IPCAPI.getFetchResponse(fetchId);
    }

    static async loadRootPromptMetadata(profileName:string) {
        return await IPCAPI.loadRootPromptMetadata(profileName);
    }
    static async loadModulePromptMetadata(profileName:string, moduleName:string) {
        return await IPCAPI.loadModulePromptMetadata(profileName, moduleName);
    }
    static async loadPromptTemplate(profileName:string, moduleName:string, promptName:string) {
        return await IPCAPI.loadPromptTemplate(profileName, moduleName, promptName);
    }
    
    static async getProfileNames() {
        return await IPCAPI.getProfileNames();
    }

    static async createProfile(name:string) {
        await IPCAPI.createProfile(name);
    }

    static async deleteProfile(name:string) {
        await IPCAPI.deleteProfile(name);
    }

    static async loadProfileValue(profileName:string, filename:string, key:string) {
        return await IPCAPI.loadProfileValue(profileName, filename, key);
    }
    static async storeProfileValue(profileName:string, filename:string, key:string, value:any) {
        await IPCAPI.storeProfileValue(profileName, filename, key, value);
    }

    static async loadProfileHistory(profileName:string, historyName:string, offset:number, limit:number) {
        return await IPCAPI.loadProfileHistory(profileName, historyName, offset, limit);
    }

    static async storeProfileHistory(profileName:string, historyName:string, data:any) {
        await IPCAPI.storeProfileHistory(profileName, historyName, data);
    }

    static async deleteProfileHistory(profileName:string, historyName:string, id:number) {
        IPCAPI.deleteProfileHistory(profileName, historyName, id);
    }

    static async deleteAllProfileHistory(profileName:string, historyName:string) {
        await IPCAPI.deleteAllProfileHistory(profileName, historyName);
    }

    static isNewVersionAvailable():any {
        throw new NotImplementedError();
    }

    static async writeLog(name:string, message:string, showDatetime:boolean=false) {
        await IPCAPI.writeLog(name, message, showDatetime);
    }


    /**
     * @deprecated use fetch() and getFetchResponse() instead
     */
    static async proxyFetch(url:string, init:any):Promise<any> {
        const id = await this.fetch(url, init);

        return await this.getFetchResponse(id);
    }

    /**
     * @deprecated use loadRootPromptMetadata() instead
     */
    static storeSecretValue(cookieName:string, value:any) {
        this.storeProfileValue('guest', 'secret.json', cookieName, value);
    }

    /**
     * @deprecated use loadProfileValue() instead
     */
    static loadSecretValue(cookieName:string) {
        return this.loadProfileValue('guest', 'secret.json', cookieName);
    }

    /**
     * @deprecated use storeProfileValue() instead
     */
    static storeValue(cookieName:string, value:any) {
        this.storeProfileValue('guest', 'config.json', cookieName, value);
    }

    /**
     * @deprecated use loadProfileValue() instead
     */
    static loadValue(cookieName:string) {
        return this.loadProfileValue('guest', 'config.json', cookieName);
    }

    /**
     * @deprecated use loadProfileHistory() instead
     */
    static loadHistory(historyName:string|number, offset:number, limit:number):any {
        return this.loadProfileHistory('guest', historyName.toString(), offset, limit);
    }

    /**
     * @deprecated use storeProfileHistory() instead
     */
    static storeHistory(historyName:string|number, data:any) {
        this.storeProfileHistory('guest', historyName.toString(), data);
    }

    /**
     * @deprecated use deleteProfileHistory() instead
     */
    static deleteHistory(historyName:string|number) {
        this.deleteAllProfileHistory('guest', historyName.toString());
    }
}

export default LocalAPI;
import { TARGET_ENV, VERSION } from 'data/constants'
import { IPCInteractive } from './ipcInteractive';
import { NotImplementedError } from 'features/errors';

const errorNotAvailable = () => new Error('This feature is not available on this platform.');

export class LocalInteractive {
    static echo(message:any) {
        switch(TARGET_ENV) {
            case 'WEB':
                console.log(message);
                break;
            case 'WINDOWS':
                return IPCInteractive.echo(message);
            default:
                throw errorNotAvailable();
        }
    }

    static openBrowser(url:string) {
        switch(TARGET_ENV) {
            case 'WINDOWS':
                IPCInteractive.openBrowser(url);
                break;
            default:
                throw errorNotAvailable();
        }
    }

    static openPromptDirectory() {
        switch(TARGET_ENV) {
            case 'WINDOWS':
                IPCInteractive.openPromptDirectory();
                break;
            default:
                throw errorNotAvailable();
        }
    }

    static fetch(url:string, init:any):number {
        switch(TARGET_ENV) {
            case 'WINDOWS':
                return IPCInteractive.fetch(url, init);
            default:
                throw errorNotAvailable();
        }
    }

    static abortFetch(fetchId:number):void {
        switch(TARGET_ENV) {
            case 'WINDOWS':
                IPCInteractive.abortFetch(fetchId);
                break;
            default:
                throw errorNotAvailable();
        }
    }

    static async getFetchResponse(fetchId:number):Promise<any> {
        switch(TARGET_ENV) {
            case 'WINDOWS':
                return IPCInteractive.getFetchResponse(fetchId);
            default:
                throw errorNotAvailable();
        }
    }

    static loadRootPromptMetadata(profileName:string) {
        switch(TARGET_ENV) {
            case 'WINDOWS':
                return IPCInteractive.loadRootPromptMetadata(profileName);
            default:
                throw errorNotAvailable();
        }
    }
    static loadModulePromptMetadata(profileName:string, moduleName:string) {
        switch(TARGET_ENV) {
            case 'WINDOWS':
                return IPCInteractive.loadModulePromptMetadata(profileName, moduleName);
            default:
                throw errorNotAvailable();
        }
    }
    static loadPromptTemplate(profileName:string, moduleName:string, promptName:string) {
        switch(TARGET_ENV) {
            case 'WINDOWS':
                return IPCInteractive.loadPromptTemplate(profileName, moduleName, promptName);
            default:
                throw errorNotAvailable();
        }
    }
    
    static getProfileNames() {
        switch(TARGET_ENV) {
            case 'WINDOWS':
                return IPCInteractive.getProfileNames();
            default:
                throw errorNotAvailable();
        }
    }

    static createProfile(name:string) {
        switch(TARGET_ENV) {
            case 'WINDOWS':
                IPCInteractive.createProfile(name);
                break;
            default:
                throw errorNotAvailable();
        }
    }

    static deleteProfile(name:string) {
        switch(TARGET_ENV) {
            case 'WINDOWS':
                IPCInteractive.deleteProfile(name);
                break;
            default:
                throw errorNotAvailable();
        }
    }

    static loadProfileValue(profileName:string, filename:string, key:string) {
        switch(TARGET_ENV) {
            case 'WINDOWS':
                return IPCInteractive.loadProfileValue(profileName, filename, key);
            default:
                throw errorNotAvailable();
        }
    }
    static storeProfileValue(profileName:string, filename:string, key:string, value:any) {
        switch(TARGET_ENV) {
            case 'WINDOWS':
                IPCInteractive.storeProfileValue(profileName, filename, key, value);
                break;
            default:
                throw errorNotAvailable();
        }
    }

    static loadProfileHistory(profileName:string, historyName:string, offset:number, limit:number) {
        switch(TARGET_ENV) {
            case 'WINDOWS':
                return IPCInteractive.loadProfileHistory(profileName, historyName, offset, limit);
            default:
                throw errorNotAvailable();
        }
    }

    static storeProfileHistory(profileName:string, historyName:string, data:any) {
        switch(TARGET_ENV) {
            case 'WINDOWS':
                IPCInteractive.storeProfileHistory(profileName, historyName, data);
                break;
            default:
                throw errorNotAvailable();
        }
    }

    static deleteProfileHistory(profileName:string, historyName:string, id:number) {
        switch(TARGET_ENV) {
            case 'WINDOWS':
                IPCInteractive.deleteProfileHistory(profileName, historyName, id);
                break;
            default:
                throw errorNotAvailable();
        }
    }

    static deleteAllProfileHistory(profileName:string, historyName:string) {
        switch(TARGET_ENV) {
            case 'WINDOWS':
                IPCInteractive.deleteAllProfileHistory(profileName, historyName);
                break;
            default:
                throw errorNotAvailable();
        }
    }

    static isNewVersionAvailable():any {
        throw new NotImplementedError();
    }

    /**
     * @deprecated use fetch() and getFetchResponse() instead
     */
    static async proxyFetch(url:string, init:any):Promise<any> {
        const id = this.fetch(url, init);

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

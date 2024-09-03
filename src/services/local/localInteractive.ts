import { RawPromptMetadataTree } from 'features/prompts/types';
import { TARGET_ENV, VERSION } from '../../data/constants'
import { Promptlist } from './interface';
import { IPCInteractive } from './ipcInteractive';
import { WebInteractive } from './webInteractive';

const errorNotAvailable = () => new Error('This feature is not available on this platform.');

export class LocalInteractive {
    static echo(message:any) {
        switch(TARGET_ENV) {
            case 'WEB':
                console.log(message)
                break;
            case 'WINDOWS':
                return IPCInteractive.echo(message);
            default:
                throw errorNotAvailable();
        }
    }
    static loadPromptMetadata(path:string):Promise<string> {
        switch(TARGET_ENV) {
            case 'WEB':
                return WebInteractive.loadPromptMetadata(path);
            case 'WINDOWS':
                return IPCInteractive.loadPromptMetadata(path);
            default:
                throw errorNotAvailable();
        }
    }
    static loadPromptTemplate(filename:string, basePath:string=''):Promise<string> {
        let fullPath:string;
        /// @TODO : path traversal attack 체크 코드 추가
        if (basePath === '') {
            fullPath = filename;
        }
        else {
            fullPath = basePath + '/' + filename;
        }

        switch(TARGET_ENV) {
            case 'WEB':
                return WebInteractive.loadPrompt(fullPath);
            case 'WINDOWS':
                return IPCInteractive.loadPrompt(fullPath);
            default:
                throw errorNotAvailable();
        }
    }

    static proxyFetch(url:string, init:RequestInit) {
        switch(TARGET_ENV) {
        case 'WEB':
            return WebInteractive.fetch(url, init);
        case 'WINDOWS':
            return IPCInteractive.fetch(url, init);
        default:
            throw errorNotAvailable();
        }
    }

    static async storeHistory(key:any, data:any) {
        switch(TARGET_ENV) {
        case 'WEB':
            // nothing to do
            break;
        case 'WINDOWS':
            return IPCInteractive.storeHistory(key, data);
        default:
            throw errorNotAvailable();
        }
    }
    
    static async loadHistory(key:any, offset:number=0, limit:number=1000) {
        switch(TARGET_ENV) {
        case 'WEB':
            return [];
        case 'WINDOWS':
            return IPCInteractive.loadHistory(key, offset, limit);
        default:
            throw errorNotAvailable();
        }
    }
    
    static storeValue(name:string, value:any) {
        switch(TARGET_ENV) {
        case 'WEB':
            return WebInteractive.storeValue(name, value);
        case 'WINDOWS':
            return IPCInteractive.storeValue(name, value);
        default:
            throw errorNotAvailable();
        }
    }
    
    static loadValue(name:string) {
        switch(TARGET_ENV) {
        case 'WEB':
            return WebInteractive.loadValue(name);
        case 'WINDOWS':
            return IPCInteractive.loadValue(name);
        default:
            throw errorNotAvailable();
        }
    }
}

import { TARGET_ENV, VERSION } from '../../data/constants.tsx'
import { Promptlist } from './interface.ts';
import { IPCInteractive } from './ipcInteractive.ts';
import { WebInteractive } from './webInteractive.ts';

const errorNotAvailable = () => new Error("This feature is not available on this platform.");

export function loadPromptList():Promise<Promptlist> {
    switch(TARGET_ENV) {
    case "WEB":
        return WebInteractive.loadPromptlist();
    case "WINDOWS":
        return IPCInteractive.loadPromptlist();
    default:
        throw errorNotAvailable();
    }
}

export function loadPrompt(filename:string):Promise<string> {
    switch(TARGET_ENV) {
    case "WEB":
        return WebInteractive.loadPrompt(filename);
    case "WINDOWS":
        return IPCInteractive.loadPrompt(filename);
    default:
        throw errorNotAvailable();
    }
}

export function openPromptFolder() {
    switch(TARGET_ENV) {
    case "WINDOWS":
        return IPCInteractive.openPromptFolder();
    default:
        throw errorNotAvailable();
    }
}

export function storeValue(name:string, value:any) {
    switch(TARGET_ENV) {
    case "WEB":
        return WebInteractive.storeValue(name, value);
    case "WINDOWS":
        return IPCInteractive.storeValue(name, value);
    default:
        throw errorNotAvailable();
    }
}

export function loadValue(name:string) {
    switch(TARGET_ENV) {
    case "WEB":
        return WebInteractive.loadValue(name);
    case "WINDOWS":
        return IPCInteractive.loadValue(name);
    default:
        throw errorNotAvailable();
    }
}

export function storeSecretValue(name:string, value:any) {
    switch(TARGET_ENV) {
    case "WEB":
        return WebInteractive.storeValue(name, value);
    case "WINDOWS":
        return IPCInteractive.storeSecretValue(name, value);
    default:
        throw errorNotAvailable();
    }
}

export function loadSecretValue(name:string) {
    switch(TARGET_ENV) {
    case "WEB":
        return WebInteractive.loadValue(name);
    case "WINDOWS":
        return IPCInteractive.loadSecretValue(name);
    default:
        throw errorNotAvailable();
    }
}

export function proxyFetch(url:string, init:RequestInit) {
    switch(TARGET_ENV) {
    case "WEB":
        return WebInteractive.fetch(url, init);
    case "WINDOWS":
        return IPCInteractive.fetch(url, init);
    default:
        throw errorNotAvailable();
    }
}

export function openBrowser(url:string) {
    switch(TARGET_ENV) {
    case "WEB":
        return WebInteractive.openBrowser(url);
    case "WINDOWS":
        return IPCInteractive.openBrowser(url);
    default:
        throw errorNotAvailable();
    }
}

export async function isNewVersionAvailable() {
    const isLastGreater = (currenVersion, newVersion) => {
        const compare = (current:number, last:number) => {
            const lastNum = Number(last);
            const currentNum = Number(current);
            if (lastNum > currentNum) return true;
            else if (lastNum < currentNum) return false;
            else return null;
        }
        const cv = currenVersion;
        const nv = newVersion;
        
        return compare(cv[1], nv[1])
            ?? compare(cv[2], nv[2])
            ?? compare(cv[3], nv[3])
            ?? false;
    }
    const patternVersion = /v(\d+)[.](\d+)[.](\d+)/;

    switch(TARGET_ENV) {
    case "WEB":
        return false;
    case "WINDOWS":
    {
        const lastVersion:string = await fetchLastVersion();
        const currentVersionMatch = VERSION.match(patternVersion);
        let lastVersionMatch: RegExpMatchArray | null;

        if (!lastVersion || !currentVersionMatch) {
            return false;
        }
        else if (lastVersionMatch = lastVersion.match(patternVersion)) {
            return isLastGreater(currentVersionMatch, lastVersionMatch);
        }
        else {
            return false;
        }
    }
    default:
        throw errorNotAvailable();
    }
}

export async function fetchLastVersion() {
    try {
        const url = "https://api.github.com/repos/hve4638/ai-front/releases/latest";
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();

            return data.tag_name;
        }
    }
    catch(error) {
        return null;
    }
}

export async function resetAllValues() {
    switch(TARGET_ENV) {
    case "WEB":
        return WebInteractive.resetAllValues();
    case "WINDOWS":
        return IPCInteractive.resetAllValues();
    default:
        throw errorNotAvailable();
    }
}

export async function storeHistory(key:any, data:any) {
    switch(TARGET_ENV) {
    case "WEB":
        // nothing to do
        break;
    case "WINDOWS":
        return IPCInteractive.storeHistory(key, data);
    default:
        throw errorNotAvailable();
    }
}

export async function loadHistory(key:any, offset:number=0, limit:number=1000) {
    switch(TARGET_ENV) {
    case "WEB":
        return [];
    case "WINDOWS":
        return IPCInteractive.loadHistory(key, offset, limit);
    default:
        throw errorNotAvailable();
    }
}

export async function deleteHistory(key:any) {
    switch(TARGET_ENV) {
    case "WEB":
        return [];
    case "WINDOWS":
        return IPCInteractive.deleteHistory(key);
    default:
        throw errorNotAvailable();
    }
}
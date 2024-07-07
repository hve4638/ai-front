import { TARGET_ENV } from '../../data/constants.tsx'
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

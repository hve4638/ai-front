import { BrowserWindow } from 'electron';
import { ChatAIResult } from '@hve/chatai';
import { IPCListenerPing } from '@/data';
import runtime from '@/runtime';
import { RTClosed } from './errors';

class RTSender {
    disabled:boolean = false;

    constructor(private browserWindowRef:WeakRef<BrowserWindow>, private token: string) {
        
    }

    disable() {
        this.disabled = true;
    }
    
    sendStream(text:string) {
        if (this.disabled) throw new RTClosed();

        const window = this.browserWindowRef.deref();
        if (window) {
            console.trace(`RTSender.sendStream (${this.token})`, text);
            window.webContents.send(IPCListenerPing.Request, this.token, {
                type : 'stream',
                text : text,
            } satisfies RequestRTData);
        }
    }

    sendResult(text:string, response?:ChatAIResult) {
        if (this.disabled) throw new RTClosed();

        const window = this.browserWindowRef.deref();
        if (window) {
            console.trace(`RTSender.sendResult (${this.token})`, text, response);
            window.webContents.send(IPCListenerPing.Request, this.token, {
                type : 'result',
                text : text,
                response : response,
            } satisfies RequestRTData);
        }
    }

    sendHistoryUpdate() {
        if (this.disabled) throw new RTClosed();

        const window = this.browserWindowRef.deref();
        if (window) {
            console.trace(`RTSender.sendHistoryUpdate (${this.token})`);
            window.webContents.send(IPCListenerPing.Request, this.token, {
                type : 'history_update',
            } satisfies RequestRTData);
        }
    }

    sendNoResult() {
        if (this.disabled) throw new RTClosed();

        const window = this.browserWindowRef.deref();
        if (window) {
            console.trace(`RTSender.sendNoResult (${this.token})`);
            window.webContents.send(IPCListenerPing.Request, this.token, {
                type : 'no_result',
            } satisfies RequestRTData);
        }
    }

    sendClose() {
        const window = this.browserWindowRef.deref();
        if (window) {
            console.trace(`RTSender.sendClose (${this.token})`);
            window.webContents.send(IPCListenerPing.Request, this.token, {
                type : 'close',
            } satisfies RequestRTData);
        }
    }

    sendError(message:string, detail:string[] = []) {
        if (this.disabled) throw new RTClosed();
        
        const window = this.browserWindowRef.deref();
        console.trace(`RTSender.sendError (${this.token})`, message, detail);
        if (window) {
            window.webContents.send(IPCListenerPing.Request, this.token, {
                type : 'error',
                message,
                detail,
            } satisfies RequestRTData);
        }
    }
}

export default RTSender;
import { BrowserWindow } from 'electron';
import { IPCListenerPing } from '@/data';
import { ChatAIResult } from '@hve/chatai';

class RTSender {
    constructor(private browserWindowRef:WeakRef<BrowserWindow>, private token: string) {

    }
    
    sendStream(text:string) {
        const window = this.browserWindowRef.deref();
        if (window) {
            window.webContents.send(IPCListenerPing.Request, this.token, {
                type : 'stream',
                text : text,
            } satisfies RequestRTData);
        }
    }

    sendResult(text:string, response?:ChatAIResult) {
        const window = this.browserWindowRef.deref();
        if (window) {
            window.webContents.send(IPCListenerPing.Request, this.token, {
                type : 'result',
                text : text,
                response : response,
            } satisfies RequestRTData);
        }
    }

    sendClose() {
        const window = this.browserWindowRef.deref();
        if (window) {
            window.webContents.send(IPCListenerPing.Request, this.token, {
                type : 'close',
            } satisfies RequestRTData);
        }
    }

    sendError(text:string) {
        const window = this.browserWindowRef.deref();
        if (window) {
            window.webContents.send(IPCListenerPing.Request, this.token, {
                type : 'error',
                text : text,
                data : null,
            } satisfies RequestRTData);
        }
    }
}

export default RTSender;
import { BrowserWindow } from 'electron';
import { ChatAIResult } from '@hve/chatai';
import { IPCListenerPing } from '@/data';
import runtime from '@/runtime';
import { RTClosed } from './errors';

class RTSender {
    disabled: boolean = false;

    constructor(private browserWindowRef: WeakRef<BrowserWindow>, private token: string) {

    }

    disable() {
        this.disabled = true;
    }

    #send(requestRtData: RequestRTData) {
        if (this.disabled) throw new RTClosed();

        this.#sendForce(requestRtData);
    }

    #sendForce(requestRtData: RequestRTData) {
        const window = this.browserWindowRef.deref();
        if (window) {
            window.webContents.send(IPCListenerPing.Request, this.token, requestRtData);
        }
    }

    sendClearOutput() {
        console.trace(`RTSender.sendClearOutput (${this.token})`);
        this.#send({
            type: 'output_clear',
        });
    }

    sendStream(text: string) {
        console.trace(`RTSender.sendStream (${this.token})`, text);
        this.#send({
            type: 'stream',
            text: text,
        });
    }

    sendResult(text: string, response?: ChatAIResult) {
        console.trace(`RTSender.sendResult (${this.token})`, text, response);
        this.#send({
            type: 'result',
            text: text,
            response: response,
        });
    }

    sendHistoryUpdate() {
        console.trace(`RTSender.sendHistoryUpdate (${this.token})`);
        this.#send({
            type: 'history_update',
        });
    }

    sendInputUpdate() {
        console.trace(`RTSender.sendInputUpdate (${this.token})`);
        this.#send({
            type: 'input_update',
        });
    }

    sendNoResult() {
        console.trace(`RTSender.sendNoResult (${this.token})`);
        this.#send({
            type: 'no_result',
        });
    }

    sendClose() {
        console.trace(`RTSender.sendClose (${this.token})`);
        this.#sendForce({
            type: 'close',
        });
    }

    sendError(message: string, detail: string[] = []) {
        console.trace(`RTSender.sendError (${this.token})`, message, detail);
        this.#sendForce({
            type: 'error',
            message,
            detail,
        });
    }
}

export default RTSender;
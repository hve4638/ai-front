import { IPCError } from 'api/error';
import LocalAPI from 'api/local';
import Channel from '@hve/channel';

interface ResultData {
    type : 'result'|'stream'|'done';
    data : unknown;
}

class RequestAPI {
    #bindId: number|null = null;
    #channels = new Map<string, Channel<ResultData>>();

    constructor() {}

    async register() {
        if (this.#bindId) return;
        const binded = this.#onRequest.bind(this)

        this.#bindId = await LocalAPI.addRequestListener(binded);
    }
    async unregister() {
        if (this.#bindId == null) return;

        await LocalAPI.removeRequestListener(this.#bindId);
        this.#bindId = null;
    }

    #setCh(profileId:string, chId:string) {
        this.#channels.set(chId, new Channel<ResultData>());
    }

    #getCh(chId:string) {
        const ch = this.#channels.get(chId);
        if (!ch) throw new Error(`Response channel is closed : '${chId}'`);

        return ch;
    }

    #removeCh(profileId:string, chId:string) {
        this.#channels.delete(chId);
    }

    async request(profileId:string, rtId:string, input:RTInput):Promise<string> {
        const [err, chId] = await window.electron.RequestProfileRT(profileId, rtId, input);
        if (err) throw new IPCError(err.message);

        this.#setCh(profileId, chId);

        return chId;
    }

    async response(profileId:string, chId:string) {
        let ch = this.#getCh(chId);
        const result = await ch.consume();
        if (result.type == 'done') {
            this.#removeCh(profileId, chId);
        }
        return result;
    }
    
    #onRequest(event:any, chId:string, message: any) {
        let ch = this.#getCh(chId);
        if (!ch) {
            ch = new Channel<ResultData>();
            this.#channels.set(chId, ch);
        }

        ch.produce(message);
    }
}

export default RequestAPI;
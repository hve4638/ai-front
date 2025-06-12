import LocalAPI from 'api/local';
import Channel from '@hve/channel';
import { v7 as uuidv7 } from 'uuid';

/**
 * RT 요청 수행 API
 * 
 * Electron-Front 간 IPC 통신 중계
 * 
 * 더 높은 계층에서의 처리는 RequestManager에서 수행
 */
class RequestAPI {
    static instance: RequestAPI | null = null;
    #bindId: number|null = null;
    #channels = new Map<string, Channel<RequestRTData>>();

    static getInstance() {
        RequestAPI.instance ??= new RequestAPI();
        return RequestAPI.instance;
    }

    private constructor() {}

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

    #openCh(chId:string) {
        if (!this.#channels.get(chId)) {
            this.#channels.set(chId, new Channel<RequestRTData>());
        }
    }
    
    #getCh(chId:string) {
        const ch = this.#channels.get(chId);
        if (!ch) {
            console.trace(`Response channel not found : '${chId}'`);
            throw new Error(`Response channel is closed : '${chId}'`);
        }

        return ch;
    }

    #closeCh(chId:string) {
        this.#channels.delete(chId);
    }

    async request(profileId:string, sessionId:string):Promise<string> {
        const chId = uuidv7();
        this.#openCh(chId);

        await LocalAPI.request.requestRT(chId, profileId, sessionId);

        return chId;
    }

    async response(chId:string) {
        let ch = this.#getCh(chId);
        const result = await ch.consume();

        if (result.type == 'close') {
            this.#closeCh(chId);
        }
        return result;
    }
    
    #onRequest(event:any, chId:string, data: RequestRTData) {
        const ch = this.#getCh(chId);

        ch.produce(data);
    }
}

export default RequestAPI;
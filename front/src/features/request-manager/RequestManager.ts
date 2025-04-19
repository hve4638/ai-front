import RequestAPI from "@/api/request";
import ProfilesAPI, { SessionAPI } from "@/api/profiles";
import { useSessionStore, useSignalStore } from "@/stores";

class RequestManager {
    static instance: RequestManager | null = null;

    static getInstance() {
        if (!RequestManager.instance) {
            RequestManager.instance = new RequestManager();
        }
        return RequestManager.instance;
    }

    private constructor() {
        
    }

    async request(profileId: string, sessionId: string) {
        const profileAPI = await ProfilesAPI.getProfile(profileId);
        const sessionAPI = profileAPI.getSessionAPI(sessionId);

        // @TODO
        // Front(입력)->Electron(저장)->Front(불러옴)->Electron(요청) 구조
        // 추후 더 나은 구조가 있다면 개선필요
        const { input } = await sessionAPI.get('cache.json', ['input']) as { input: string };
        const { rt_id, model_id } = await sessionAPI.get('config.json', ['rt_id', 'model_id']) as { rt_id: string, model_id: string };
        const rtInput:RTInput = {
            input : input,
            chat : [],
            form : {},
            modelId : model_id,
            rtId: rt_id,
            sessionId: sessionId,
        };
        RequestAPI.request(profileId, rtInput).then((chId) => {
            this.handleResponse(chId, sessionAPI);
        });
    }
    
    private async handleResponse(chId:string, sessionAPI:SessionAPI) {
        {
            sessionAPI.set('cache.json', { 'state': 'loading' })
            const sessionState = useSessionStore.getState();
            if (sessionState.deps.last_session_id === sessionAPI.id) {
                sessionState.refetch.state();
            }
            useSignalStore.getState().signal.session_metadata();
        }
        while (true) {
            const data = await RequestAPI.response(chId);
            if (data.type === 'result') {
                await sessionAPI.set('cache.json', {
                    'output' : data.text,
                    'state' : 'done',
                });
                
                const sessionState = useSessionStore.getState();
                if (sessionState.deps.last_session_id === sessionAPI.id) {
                    sessionState.refetch.output();
                }
                useSignalStore.getState().signal.session_metadata();
            }
            if (data.type === 'close') break;
        }
    }
}

export default RequestManager;
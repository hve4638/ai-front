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
        const sessionAPI = ProfilesAPI.profile(profileId).session(sessionId);

        RequestAPI.request(profileId, sessionId)
            .then((chId) => {
                this.handleResponse(chId, sessionAPI);
            })
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

        let normalExit = false;
        while (true) {
            const data = await RequestAPI.response(chId);
            if (data.type === 'result') {
                normalExit = true;

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
            if (data.type === 'error') {
                // data.data
            }
            if (data.type === 'close') {
                if (normalExit) break;
                
                console.error('Request closed unexpectedly');
                await sessionAPI.set('cache.json', {
                    'output' : 'request closed unexpectedly',
                    'state' : 'done',
                });
                const sessionState = useSessionStore.getState();
                if (sessionState.deps.last_session_id === sessionAPI.id) {
                    sessionState.refetch.output();
                }
                useSignalStore.getState().signal.session_metadata();

                break;
            }
        }
    }
}

export default RequestManager;
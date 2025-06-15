import RequestAPI from "@/api/request";
import ProfilesAPI, { SessionAPI } from "@/api/profiles";
import { useSessionStore, useSignalStore } from "@/stores";
import useErrorLogStore from "@/stores/useErrorLogStore";
import useToastStore from "@/stores/useToastStore";

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

    private async handleResponse(chId: string, sessionAPI: SessionAPI) {
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
                    'output': data.text,
                    'state': 'done',
                });

                const sessionState = useSessionStore.getState();
                if (sessionState.deps.last_session_id === sessionAPI.id) {
                    sessionState.refetch.output();
                    sessionState.refetch.state();
                }
                useSignalStore.getState().signal.session_metadata();
            }
            else if (data.type === 'no_result') {
                console.warn('No result received from request:', data);
                normalExit = true;
                await sessionAPI.set('cache.json', {
                    'state': 'done',
                });
                const sessionState = useSessionStore.getState();
                if (sessionState.deps.last_session_id === sessionAPI.id) {
                    sessionState.refetch.state();
                }
                useSignalStore.getState().signal.session_metadata();
            }
            if (data.type === 'error') {
                useToastStore.getState().add(
                    '요청이 실패했습니다',
                    data.message,
                    'error'
                );
                useErrorLogStore.getState().add({
                    message: data.message,
                    detail: data.detail,
                    occurredAt: {
                        type: 'session',
                        sessionId: sessionAPI.id,
                    },
                });
            }
            if (data.type === 'history_update') {
                const sessionState = useSessionStore.getState();
                if (sessionState.deps.last_session_id === sessionAPI.id) {
                    useSignalStore.getState().signal.refresh_chat();
                }
            }
            if (data.type === 'close') {
                console.warn('Request closed:', data);
                const sessionState = useSessionStore.getState();

                if (normalExit) break;
                await sessionAPI.set('cache.json', {
                    'state': 'done',
                });
                useSignalStore.getState().signal.session_metadata();
                if (sessionState.deps.last_session_id === sessionAPI.id) {
                    sessionState.refetch.state();
                }
                useSignalStore.getState().signal.session_metadata();

                useToastStore.getState().add(
                    'Request closed unexpectedly',
                    null,
                    'warn'
                );
                break;
            }
        }
    }
}

export default RequestManager;
import { create } from 'zustand'
import useProfileAPIStore from './useProfileAPIStore';
import useCacheStore from './useCacheStore';
import useDataStore from './useDataStore';
import { ProfileSessionMetadata } from '@/types';

import { v7 } from 'uuid';
import useConfigStore from './useConfigStore';

type ProviderName = 'openai'|'anthropic'|'google';

interface ProfileEventState {
    createSession(): Promise<void>;
    removeSession(sid:string): Promise<void>;
    reorderSessions(sessionIds:string[]): Promise<void>;
    undoRemoveSession(): Promise<void>;
    
    getSessionMetadataList(): Promise<ProfileSessionMetadata[]>;
    isModelStarred(key:string): boolean;
    starModel(modelKey:string): Promise<void>;
    unstarModel(modelKey:string): Promise<void>;

    addAPIKey(provider:ProviderName, apiKey:string): Promise<void>;
    removeAPIKey(provider:ProviderName, index:number): Promise<void>;
    changeAPIKeyType(provider:ProviderName, index:number, type:'primary'|'secondary'): Promise<void>;

    getRTTree(): Promise<RTMetadataTree>;
    updateRTTree(tree:RTMetadataTree): Promise<void>;
    hasRTId(id:string): Promise<boolean>;
    generateRTId(): Promise<string>;
    changeRTId(oldId:string, newId:string): Promise<void>;
    addRT(metadata:RTMetadata): Promise<void>;
    removeRT(rtId:string): Promise<void>;
}

const useProfileEvent = create<ProfileEventState>((set)=>{
    const state:ProfileEventState = {
        async createSession() {
            const { api } = useProfileAPIStore.getState();
            const { update : updateCacheState } = useCacheStore.getState();
            const { refetch : refetchDataState } = useDataStore.getState();

            const sid = await api.createSession();
            await Promise.all([
                updateCacheState.last_session_id(sid),
                refetchDataState.sessions(),
            ]);
        },
        async removeSession(sessionId:string) {
            const { api } = useProfileAPIStore.getState();
            const { sessions } = useDataStore.getState();
            const { update : updateCache, last_session_id } = useCacheStore.getState();
            const { refetch : refetchDataState } = useDataStore.getState();
            await api.removeSession(sessionId);
            
            // 세션 0개는 허용되지 않으므로 제거 후 새 세션 생성
            if (sessions.length == 1) {
                await state.createSession();
            }
            // 현재 가르키는 세션 제거 시, 가르키는 세션을 변경
            else if (sessionId === last_session_id) {
                const prevIndex = sessions.indexOf(sessionId);
                if (prevIndex < 0) {
                    await updateCache.last_session_id(sessions[0]);
                }
                else if (prevIndex === 0) {
                    await updateCache.last_session_id(sessions[1]);
                }
                else {
                    await updateCache.last_session_id(sessions[prevIndex - 1]);
                }
            }
            await refetchDataState.sessions();
        },
        async reorderSessions(sessionIds:string[]) {
            const { api } = useProfileAPIStore.getState();
            const dataState = useDataStore.getState();

            await api.reorderSessions(sessionIds);
            await dataState.refetch.sessions();
        },
        async undoRemoveSession() {
            const { api } = useProfileAPIStore.getState();
            const dataState = useDataStore.getState();

            await api.undoRemoveSession();
            await dataState.refetch.sessions();
        },
        async getSessionMetadataList() {
            const { api } = useProfileAPIStore.getState();
            const { sessions } = useDataStore.getState();
            if (sessions == null) {
                return [];
            }

            const promises:ProfileSessionMetadata[] = await Promise.all(
                sessions.map(async (sid) => {
                    const sessionAPI = api.getSessionAPI(sid);
                    const configPromise = sessionAPI.get('config.json', [
                        'name', 'color', 'delete_lock', 'model_id', 'rt_id'
                    ]);
                    const cachePromise = sessionAPI.get('cache.json', [
                        'state'
                    ]);
                    const { name, color, delete_lock, model_id, rt_id } = await configPromise;
                    const { state } = await cachePromise;
                    
                    return {
                        id : sid,
                        name : name ?? sid,
                        color : color,
                        deleteLock : delete_lock ?? false,
                        modelId : model_id,
                        rtId : rt_id,
                        state: state ?? 'idle',
                    }
                })
            )
            return promises;
        },

        isModelStarred(key) {
            const { starred_models } = useDataStore.getState();
            return starred_models.includes(key);
        },
        async starModel(modelKey:string) {
            const { starred_models, update : updateData } = useDataStore.getState();
            updateData.starred_models([...starred_models, modelKey]);
        },
        async unstarModel(modelKey:string) {
            const { starred_models, update : updateData } = useDataStore.getState();
            const filtered = starred_models.filter(item=>item !== modelKey);
            updateData.starred_models(filtered);
        },

        async addAPIKey(provider:ProviderName, apiKey:string) {
            const { api } = useProfileAPIStore.getState();
            const { api_keys_metadata, refetch : refetchData } = useDataStore.getState();
            
            let secretId:string;
            while (true) {
                secretId = v7();
                const exist = await api.hasSecret('secret.json', [secretId]);
                if (!exist[0]) {
                    break;
                }
                console.info(`secret id duplicated: ${secretId}`);
            }
            
            const displayName = maskSecret(apiKey);
            await api.setSecret('secret.json', [[secretId, apiKey]]);
            await api.set('data.json', {
                api_keys : {
                    [provider] : [
                        ...(api_keys_metadata[provider] ?? []),
                        {
                            secret_id : secretId,
                            display_name : displayName,
                            activate : true,
                            type : 'primary',
                            last_access : -1,
                        }
                    ]
                }
                
            });
            await refetchData.api_keys_metadata();
        },
        async removeAPIKey(provider:ProviderName, index:number) {
            const { api } = useProfileAPIStore.getState();
            const dataState = useDataStore.getState();

            const providerAPIKeysMetadata = dataState.api_keys_metadata[provider];
            if (providerAPIKeysMetadata == null) return;

            const target = providerAPIKeysMetadata[index];
            if (target == null) return;

            const next = providerAPIKeysMetadata.filter((_, i) => i !== index);
            const targetSecretId = target.secret_id;
            await api.removeSecret('secret.json', [targetSecretId]);
            await api.set('data.json', {
                api_keys : {
                    [provider] : next
                }
            });
            await dataState.refetch.api_keys_metadata();
        },
        async changeAPIKeyType(provider:ProviderName, index:number, type:'primary'|'secondary') {
            const { api } = useProfileAPIStore.getState();
            const dataState = useDataStore.getState();

            const metadata = dataState.api_keys_metadata[provider];
            if (metadata == null) return;

            const target = metadata[index];
            if (target == null) return;
            target.type = type;
            
            await api.set('data.json', {
                api_keys : {
                    [provider] : metadata
                }
            });
            await dataState.refetch.api_keys_metadata();
        },

        async getRTTree() {
            const { api } = useProfileAPIStore.getState();

            return await api.getRTTree();
        },
        async updateRTTree(tree:RTMetadataTree) {
            const { api } = useProfileAPIStore.getState();

            return await api.updateRTTree(tree);
        },
        async hasRTId(id:string) {
            const { api } = useProfileAPIStore.getState();

            return await api.hasRTId(id);
        },
        async generateRTId() {
            const { api } = useProfileAPIStore.getState();

            return await api.generateRTId();
        },
        async addRT(metadata:RTMetadata) {
            const { api } = useProfileAPIStore.getState();
        
            return await api.addRT(metadata);
        },
        async removeRT(rtId:string) {
            const { api } = useProfileAPIStore.getState();
        
            return await api.removeRT(rtId);
        },
        async changeRTId(oldId:string, newId:string) {
            const { api } = useProfileAPIStore.getState();

            return await api.changeRTId(oldId, newId); 
        },
    }

    return state;
});

const maskSecret = (key:string) => {
    if (key.length <= 16) {
        return key.length === 0 ? '' : '*'.repeat(key.length);
    }
    else {
        return `${key.slice(0, 3)}...${key.slice(-4)}`;
    }
}

export default useProfileEvent;
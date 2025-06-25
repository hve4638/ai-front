import { create } from 'zustand'
import useProfileAPIStore from '../useProfileAPIStore';
import useCacheStore from '../useCacheStore';
import useDataStore from '../useDataStore';
import { ProfileSessionMetadata } from '@/types';

import { v7 } from 'uuid';
import i18next from 'i18next';
import useSessionStore from '../useSessionStore';
import useSignalStore from '../useSignalStore';
import { useHistoryStore } from '../useHistoryStore';
import SessionHistory from '@/features/session-history';
import useMemoryStore from '../useMemoryStore';

type ProviderName = 'openai' | 'anthropic' | 'google' | 'vertexai' | 'custom';

type PromptVarWithLastValue = (PromptVar & { last_value?: unknown });

interface ProfileEventState {
    createSession(): Promise<void>;
    removeSession(sid: string): Promise<void>;
    reorderSessions(sessionIds: string[]): Promise<void>;
    undoRemoveSession(): Promise<void>;

    getSessionMetadataList(): Promise<ProfileSessionMetadata[]>;

    // 모델 관련
    filterModels(): Promise<ChatAIModels>;
    isModelStarred(key: string): boolean;
    starModel(modelKey: string): Promise<void>;
    unstarModel(modelKey: string): Promise<void>;

    addAuthKey(provider: ProviderName, apiKey: string, memo?: string): Promise<void>;
    addVertexAIAPIKey(data: VertexAIAuth, memo?: string): Promise<void>;
    removeAPIKey(provider: ProviderName, index: number): Promise<void>;
    changeAPIKeyType(provider: ProviderName, index: number, type: 'primary' | 'secondary'): Promise<void>;

    getRTTree(): Promise<RTMetadataTree>;
    updateRTTree(tree: RTMetadataTree): Promise<void>;
    hasRTId(id: string): Promise<boolean>;
    generateRTId(): Promise<string>;
    changeRTId(oldId: string, newId: string): Promise<void>;

    createRT(metadata: RTMetadata, templateId: string): Promise<string>;
    /** @deprecated use `createRT` instead */
    addRT(metadata: RTMetadata): Promise<void>;
    removeRT(rtId: string): Promise<void>;
    renameRT(rtId: string, newName: string): Promise<void>;

    getCurrentSessionForms(): Promise<PromptVarWithLastValue[]>;
    setCurrentSessionForms(values: Record<string, any>): Promise<void>;

    deleteHistoryMessage(historyId: number, origin: 'in' | 'out' | 'both'): Promise<void>;

    verifyAPIKey(apiKeyId: string): Promise<boolean>;

    setCustomModel(model: CustomModelCreate): Promise<void>;
    removeCustomModel(customModel: string): Promise<void>;
}

const useProfileEvent = create<ProfileEventState>((set) => {
    const state: ProfileEventState = {
        async createSession() {
            const { api } = useProfileAPIStore.getState();
            const { update: updateCacheState } = useCacheStore.getState();
            const { refetch: refetchDataState } = useDataStore.getState();

            const sid = await api.sessions.add();
            await Promise.all([
                updateCacheState.last_session_id(sid),
                refetchDataState.sessions(),
            ]);
        },
        async removeSession(sessionId: string) {
            const { api } = useProfileAPIStore.getState();
            const { sessions } = useDataStore.getState();
            const { update: updateCache, last_session_id } = useCacheStore.getState();
            const { refetch: refetchDataState } = useDataStore.getState();

            const sessionAPI = api.session(sessionId);
            const { delete_lock } = await sessionAPI.get('config.json', ['delete_lock']);
            if (delete_lock) {
                return;
            }

            await api.sessions.remove(sessionId);

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
        async reorderSessions(sessionIds: string[]) {
            const { api } = useProfileAPIStore.getState();
            const dataState = useDataStore.getState();

            await api.sessions.reorder(sessionIds);
            await dataState.refetch.sessions();
        },
        async undoRemoveSession() {
            const { api } = useProfileAPIStore.getState();
            const dataState = useDataStore.getState();

            await api.sessions.undoRemoved();
            await dataState.refetch.sessions();
        },
        async getSessionMetadataList() {
            const { api } = useProfileAPIStore.getState();
            const { sessions } = useDataStore.getState();
            if (sessions == null) {
                return [];
            }

            const promises: ProfileSessionMetadata[] = await Promise.all(
                sessions.map(async (sid) => {
                    const sessionAPI = api.session(sid);
                    const configPromise = sessionAPI.get('config.json', [
                        'name', 'color', 'delete_lock', 'model_id', 'rt_id'
                    ]);
                    const cachePromise = sessionAPI.get('cache.json', [
                        'state'
                    ]);
                    const { name, color, delete_lock, model_id, rt_id } = await configPromise;
                    const { state } = await cachePromise;

                    let displayName = name;
                    if (name == null || name === '') {
                        if (await api.rts.existsId(rt_id)) {
                            const rtAPI = api.rt(rt_id);
                            const {
                                name: rtName,
                            } = await rtAPI.getMetadata();

                            displayName = rtName;
                        }
                        else {
                            displayName = null;
                        }
                    }

                    return {
                        id: sid,
                        name: name ?? '',
                        displayName: displayName,
                        color: color,
                        deleteLock: delete_lock ?? false,
                        modelId: model_id,
                        rtId: rt_id,
                        state: state ?? 'idle',
                    }
                })
            )
            return promises;
        },
        async filterModels() {
            const caches = useCacheStore.getState();
            const { allModels } = useMemoryStore.getState();

            const newProviders: ChatAIModelProviders[] = [];
            for (const provider of allModels) {
                const newProvider: ChatAIModelProviders = {
                    name: provider.name,
                    list: [],
                };
                newProviders.push(newProvider);

                provider.list.forEach((category, index) => {
                    const newModels: ChatAIModel[] = [];

                    category.list.forEach((model) => {
                        if (model.flags.featured) {
                            newModels.push(model);
                            return;
                        }
                        // '주 모델만' 활성화 시 featured 모델만 표시
                        if (caches.setting_models_show_featured) {
                            return;
                        }
                        // '스냅샷', '실험적', '비권장'이 아니라면 표시 
                        else if (
                            !model.flags.snapshot &&
                            !model.flags.experimental &&
                            !model.flags.deprecated &&
                            !model.flags.legacy
                        ) {
                            newModels.push(model);
                        }
                        // '비권장' 우선 확인
                        // '비권장' 태그가 있으면 다른 태그 조건이 있어도 표시하지 않음
                        else if (
                            (!caches.setting_models_show_deprecated) &&
                            (model.flags.deprecated || model.flags.legacy)
                        ) {
                            return;
                        }
                        // 옵션 체크
                        else if (
                            (model.flags.snapshot && caches.setting_models_show_snapshot) ||
                            (model.flags.experimental && caches.setting_models_show_experimental) ||
                            (model.flags.deprecated && caches.setting_models_show_deprecated) ||
                            (model.flags.legacy && caches.setting_models_show_deprecated)
                        ) {
                            newModels.push(model);
                        }
                    });

                    const newCategory: ChatAIMoedelCategory = {
                        name: category.name,
                        list: newModels,
                    };
                    newProvider.list.push(newCategory);
                });
            }

            return newProviders;
        },

        isModelStarred(key) {
            const { starred_models } = useDataStore.getState();
            return starred_models.includes(key);
        },
        async starModel(modelKey: string) {
            const { starred_models, update: updateData } = useDataStore.getState();
            updateData.starred_models([...starred_models, modelKey]);
        },
        async unstarModel(modelKey: string) {
            const { starred_models, update: updateData } = useDataStore.getState();
            const filtered = starred_models.filter(item => item !== modelKey);
            updateData.starred_models(filtered);
        },

        async addAuthKey(provider: ProviderName, apiKey: string, memo: string = '') {
            const { api } = useProfileAPIStore.getState();
            const { api_keys, refetch: refetchData } = useDataStore.getState();

            let secretId: string;
            while (true) {
                secretId = v7();
                const exist = await api.verifyAsSecret('secret.json', [secretId]);
                if (!exist[0]) {
                    break;
                }
            }

            const displayName = maskSecret(apiKey);
            await api.setAsSecret('secret.json', [[secretId, apiKey]]);
            await api.set('data.json', {
                api_keys: {
                    [provider]: [
                        ...(api_keys[provider] ?? []),
                        {
                            secret_id: secretId,
                            display_name: displayName,
                            activate: true,
                            type: 'primary',
                            last_access: -1,
                            memo: memo,
                        }
                    ]
                }
            });
            await refetchData.api_keys();
        },
        async addVertexAIAPIKey(data: VertexAIAuth, memo: string = '') {
            const { api } = useProfileAPIStore.getState();
            const { api_keys, refetch: refetchData } = useDataStore.getState();
            const provider: ProviderName = 'vertexai';

            let secretId: string;
            while (true) {
                secretId = v7();
                const exist = await api.verifyAsSecret('secret.json', [secretId]);
                if (!exist[0]) {
                    break;
                }
            }

            await api.setAsSecret('secret.json', [[secretId, data]]);
            await api.set('data.json', {
                api_keys: {
                    [provider]: [
                        ...(api_keys[provider] ?? []),
                        {
                            secret_id: secretId,
                            display_name: data.project_id,
                            activate: true,
                            type: 'primary',
                            last_access: -1,
                            memo: memo,
                        }
                    ]
                }
            });
            await refetchData.api_keys();
        },
        async removeAPIKey(provider: ProviderName, index: number) {
            const { api } = useProfileAPIStore.getState();
            const dataState = useDataStore.getState();

            const providerAPIKeysMetadata = dataState.api_keys[provider];
            if (providerAPIKeysMetadata == null) return;

            const target = providerAPIKeysMetadata[index];
            if (target == null) return;

            const next = providerAPIKeysMetadata.filter((_, i) => i !== index);
            const targetSecretId = target.secret_id;
            await api.removeAsSecret('secret.json', [targetSecretId]);
            await api.set('data.json', {
                api_keys: {
                    [provider]: next
                }
            });
            await dataState.refetch.api_keys();
        },
        async changeAPIKeyType(provider: ProviderName, index: number, type: 'primary' | 'secondary') {
            const { api } = useProfileAPIStore.getState();
            const dataState = useDataStore.getState();

            const metadata = dataState.api_keys[provider];
            if (metadata == null) return;

            const target = metadata[index];
            if (target == null) return;
            target.type = type;

            await api.set('data.json', {
                api_keys: {
                    [provider]: metadata
                }
            });
            await dataState.refetch.api_keys();
        },

        async getRTTree() {
            const { api } = useProfileAPIStore.getState();

            return await api.rts.getTree();
        },
        async updateRTTree(tree: RTMetadataTree) {
            const { api } = useProfileAPIStore.getState();

            return await api.rts.updateTree(tree);
        },
        async hasRTId(id: string) {
            const { api } = useProfileAPIStore.getState();

            return await api.rts.existsId(id);
        },
        async generateRTId() {
            const { api } = useProfileAPIStore.getState();

            return await api.rts.generateId();
        },


        createRT: async (metadata: RTMetadata, templateId: string = 'empty') => {
            const { api } = useProfileAPIStore.getState();

            return await api.rts.createRTUsingTemplate(metadata, templateId);
        },
        async addRT(metadata: RTMetadata) {
            const { api } = useProfileAPIStore.getState();

            return await api.rts.add(metadata);
        },
        async removeRT(rtId: string) {
            const { api } = useProfileAPIStore.getState();

            return await api.rts.remove(rtId);
        },
        async changeRTId(oldId: string, newId: string) {
            const { api } = useProfileAPIStore.getState();

            return await api.rts.changeId(oldId, newId);
        },
        async renameRT(rtId: string, name: string) {
            const { api } = useProfileAPIStore.getState();

            await api.rt(rtId).setMetadata({ name: name });
            await api.rt(rtId).reflectMetadata();
        },

        async getCurrentSessionForms() {
            const { api } = useProfileAPIStore.getState();
            const { rt_id } = useSessionStore.getState();
            const { last_session_id } = useCacheStore.getState();

            if (last_session_id == null) throw new Error('last_session_id is null');

            const rt = api.rt(rt_id);
            const session = api.session(last_session_id);

            const forms: PromptVarWithLastValue[] = await rt.getForms();
            const formValues = await session.getFormValues(rt_id);

            for (const form of forms) {
                form.last_value = formValues[form.id!];
            }
            return forms;
        },

        async setCurrentSessionForms(values: Record<string, any>) {
            const { api } = useProfileAPIStore.getState();
            const { rt_id } = useSessionStore.getState();
            const { last_session_id } = useCacheStore.getState();

            if (last_session_id == null) throw new Error('last_session_id is null');

            const session = api.session(last_session_id);

            await session.setFormValues(rt_id, values);
        },

        async deleteHistoryMessage(historyId: number, origin: 'in' | 'out' | 'both') {
            const { api } = useProfileAPIStore.getState();
            const { last_session_id } = useSessionStore.getState().deps;

            if (!last_session_id) return;

            const history: SessionHistory = useHistoryStore.getState().get(last_session_id);

            await api.session(last_session_id).history.deleteMessage(historyId, origin);
            history.evictCache(historyId);
            useSignalStore.getState().signal.refresh_chat_without_scroll();
        },

        async verifyAPIKey(apiKeyId: string) {
            const { api } = useProfileAPIStore.getState();
            return (await api.verifyAsSecret('secret.json', [apiKeyId]))[0];
        },

        async setCustomModel(model: CustomModelCreate) {
            const { custom_models, update } = useDataStore.getState();
            const next = [...custom_models];
            
            if (model.id) {
                const index = custom_models.findIndex(item => item.id === model.id);
                if (index < 0) throw new Error('Custom model not found');

                next[index] = model as CustomModel;
            }
            else {
                model.id = 'custom:' + v7();

                next.push(model as CustomModel);
            }

            console.log('before', next);
            await update.custom_models(next);
            console.log('after', useDataStore.getState().custom_models);
        },
        async removeCustomModel(customId: string) {
            const { custom_models, update } = useDataStore.getState();
            const next = custom_models.filter(item => item.id !== customId);

            await update.custom_models(next);
        },
    }

    return state;
});

const maskSecret = (key: string) => {
    if (key.length <= 8) {
        return '*'.repeat(8);
    }
    if (key.length <= 16) {
        return key.length === 0 ? '' : '*'.repeat(key.length);
    }
    else {
        return `${key.slice(0, 3)}...${key.slice(-4)}`;
    }
}

export default useProfileEvent;
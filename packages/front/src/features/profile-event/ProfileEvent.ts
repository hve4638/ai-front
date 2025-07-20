import { ProviderName } from './types';
import {
    SessionEvent,
    RTEvent,
    ModelEvent,
    AuthEvent,
    CurrentSessionFormEvent,
    GlobalModelConfigEvent
} from './events';

class ProfileEvent {
    static readonly session = {
        create: () => SessionEvent.createSession(),
        remove: (sessionId: string) => SessionEvent.removeSession(sessionId),
        reorder: (sessionIds: string[]) => SessionEvent.reorderSessions(sessionIds),
        undo: () => SessionEvent.undoRemoveSession(),
        getMetadataList: () => SessionEvent.getSessionMetadataList(),
    }
    static readonly rt = {
        generateId: () => RTEvent.generateRTId(),

        getTree: () => RTEvent.getRTTree(),
        updateTree: (tree: RTMetadataTree) => RTEvent.updateRTTree(tree),
        exists: (id: string) => RTEvent.existsId(id),

        create: (metadata: RTMetadata, templateId: string = 'empty') => RTEvent.createRT(metadata, templateId),
        remove: (rtId: string) => RTEvent.removeRT(rtId),
        changeId: (oldId: string, newId: string) => RTEvent.changeRTId(oldId, newId),
        rename: (rtId: string, name: string) => RTEvent.renameRT(rtId, name),
    }
    static readonly model = {
        star: (modelId: string) => ModelEvent.starModel(modelId),
        unstar: (modelId: string) => ModelEvent.unstarModel(modelId),
        isStarred: (modelId: string) => ModelEvent.isModelStarred(modelId),

        filter: () => ModelEvent.filterModels(),
        getName: (modelId: string) => ModelEvent.getModelName(modelId),

        setCustom: (model: CustomModelCreate) => ModelEvent.setCustomModel(model),
        removeCustom: (customId: string) => ModelEvent.removeCustomModel(customId),

        getGlobalConfig: (modelId: string) => GlobalModelConfigEvent.getGlobalConfig(modelId),
        setGlobalConfig: (modelId: string, config: Record<string, any>) => GlobalModelConfigEvent.setGlobalConfig(modelId, config),
    }
    static readonly auth = {
        add: (provider: ProviderName, apiKey: string, memo: string = '') => AuthEvent.addAuth(provider, apiKey, memo),
        addVertexAI: (authData: VertexAIAuth, memo: string = '') => AuthEvent.addVertexAIAuth(authData, memo),
        remove: (provider: ProviderName, index: number) => AuthEvent.removeAuth(provider, index),
        changeType: (provider: ProviderName, index: number, type: 'primary' | 'secondary') => AuthEvent.changeType(provider, index, type),
        verify: (authId: string) => AuthEvent.verifyAuth(authId),
    }
    static readonly currentSession = {
        getForms: () => CurrentSessionFormEvent.getCurrentSessionForms(),
        setForms: (forms: Record<string, any>) => CurrentSessionFormEvent.setCurrentSessionForms(forms),
    }
}


export default ProfileEvent;
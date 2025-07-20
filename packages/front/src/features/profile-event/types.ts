import { ProfileSessionMetadata } from '@/types';

export type ProviderName = 'openai' | 'anthropic' | 'google' | 'vertexai' | 'custom';

export type PromptVarWithLastValue = (PromptVar & { last_value?: unknown });

export interface ProfileEventState {
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

    getModelName(modelId: string): string;
}
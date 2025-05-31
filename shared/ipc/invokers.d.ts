import '../rt/rt';
import '../rt/form';
import './args';
import '../chatai-model';
import './data';
import './declared';
import './result';

declare global {
    type IPCInvokerGeneral = {
        echo(message: string): EResult<string>;
        openBrowser(url: string): ENoResult;
    }
    
    type IPCInvokerGlobalStorage = {
        get(storageName:string, keys:string[]): EResult<Record<string, any>>;
        set(storageName:string, data:KeyValueInput): ENoResult;
    }
    
    type IPCInvokerMasterKey = {
        init(): EResult<'normal' | 'need-recovery' | 'no-data' | 'invalid-data'>;
        reset(recoveryKey: string): ENoResult;
        recover(recoveryKey: string): EResult<boolean>;
    }
    
    type IPCInvokerProfiles = {
        create(): EResult<string>;
        delete(profileName:string): ENoResult;
        getIds(): EResult<string[]>;

        getLast(): EResult<string | null>;
        setLast(profileName: string | null): ENoResult;
    }

    type IPCInvokerProfile = {
        getChatAIModels(profileId: string, option?:{ all?:boolean }): EResult<ChatAIModels>;
    }
    
    type IPCInvokerProfileStorage = {
        get(profileId: string, accessor: string, keys: string[]): EResult<Record<string, any>>;
        set(profileId: string, accessor: string, data: KeyValueInput): ENoResult;
        getAsText(profileId: string, accessor: string): EResult<string>;
        setAsText(profileId: string, accessor: string, value: string): ENoResult;
        getAsBinary(profileId: string, accessor: string): EResult<Buffer>;
        setAsBinary(profileId: string, accessor: string, content: Buffer): ENoResult;
        verifyAsSecret(profileId: string, accessor: string, keys: string[]): EResult<boolean[]>;
        setAsSecret(profileId: string, accessor: string, data: KeyValueInput): ENoResult;
        removeAsSecret(profileId: string, accessor: string, keys: string[]): ENoResult;
    };
    
    type IPCInvokerProfileSessions = {
        add(profileId: string): EResult<string>;
        remove(profileId: string, sessionId: string): ENoResult;
        undoRemoved(profileId: string): EResult<string>;
        reorder(profileId: string, sessions: string[]): ENoResult;
        getIds(profileId: string): EResult<string[]>;
    };

    type IPCInvokerProfileSession = {
        getFormValues(profileId: string, sessionId: string, rtId:string): EResult<Record<string, any>>;
        setFormValues(profileId: string, sessionId: string, rtId:string, values:Record<string, any>): ENoResult;
    }
    
    type IPCInvokerProfileSessionStorage = {
        get(profileId: string, sessionId: string, accessor: string, keys: string[]): EResult<Record<string, any>>;
        set(profileId: string, sessionId: string, accessor: string, key: KeyValueInput): ENoResult;
    };
    
    type IPCInvokerProfileSessionHistory = {
        get(profileId: string, sessionId: string, offset: number, limit: number, desc: boolean): EResult<HistoryMetadata[]>;
        search(profileId: string, sessionId: string, offset: number, limit: number, search: HistorySearch): EResult<HistoryMetadata[]>;
        getMessage(profileId: string, sessionId: string, historyId: number[]): EResult<HistoryMessage[]>;
        delete(profileId: string, sessionId: string, historyKey: number): ENoResult;
        deleteAll(profileId: string, sessionId: string): ENoResult;
    };
    
    type IPCInvokerProfileRTs = {
        getTree(profileId: string): EResult<RTMetadataTree>;
        updateTree(profileId: string, tree: RTMetadataTree): ENoResult;
        /** @deprecated use createUsingTemplate instead */
        add(profileId: string, rt: RTMetadata): ENoResult;
        createUsingTemplate(profileId: string, rtMetadata:RTMetadata, templateId: string): ENoResult;
        remove(profileId: string, rtId: string): ENoResult;

        existsId(profileId: string, rtId: string): EResult<boolean>;
        
        generateId(profileId: string): EResult<string>;
        changeId(profileId: string, oldRTId: string, newRTId: string): ENoResult;
    };
    
    type IPCInvokerProfileRT = {
        getMetadata(profileId: string, rtId: string): EResult<RTIndex>;
        setMetadata(profileId: string, rtId: string, metadata:KeyValueInput): ENoResult;
        reflectMetadata(profileId: string, rtId: string): ENoResult;

        getForms(profileId: string, rtId: string): EResult<PromptVar[]>;

        addNode(profileId: string, rtId: string, nodeCategory: string): EResult<number>;
        removeNode(profileId: string, rtId: string, nodeId: number): ENoResult;
        updateNodeOption(profileId: string, rtId: string, nodeId: number, option:Record<string, unknown>): ENoResult;
        connectNode(profileId: string, rtId: string, connectFrom:RTNodeEdge, connectTo:RTNodeEdge): ENoResult;
        disconnectNode(profileId: string, rtId: string, connectFrom:RTNodeEdge, connectTo:RTNodeEdge): ENoResult;
    };
    
    type IPCInvokerProfileRTStorage = {
        get(profileId: string, rtId: string, accessor: string, keys: string[]): EResult<Record<string, any>>;
        set(profileId: string, rtId: string, accessor: string, data: KeyValueInput): ENoResult;
    };
    
    type IPCInvokerProfileRTPrompt = {
        getMetadata(profileId:string, rtId:string, promptId:string): EResult<RTPromptData>;
        
        getName(profileId:string, rtId:string, promptId:string): EResult<string>;
        setName(profileId:string, rtId:string, promptId:string, name:string): ENoResult;
        
        getVariableNames(profileId: string, rtId: string, promptId:string): EResult<string[]>;

        getVariables(profileId: string, rtId: string, promptId:string): EResult<PromptVar[]>;
        setVariables(profileId: string, rtId: string, promptId:string, forms:PromptVar[]): EResult<string[]>;
        removeVariables(profileId: string, rtId: string, promptId:string, formIds:string[]): ENoResult;
        getContents(profileId: string, rtId: string, promptId:string): EResult<string>;
        setContents(profileId: string, rtId: string, promptId:string, contents:string): ENoResult;
    };
    
    type IPCInvokerRequest = {
        requestRT(token: string, profileId: string, sessionId: string): ENoResult;
        abort(token: string): ENoResult;
    };
}

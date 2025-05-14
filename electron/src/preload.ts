import { contextBridge, ipcRenderer } from 'electron';
import { IPCListenerPing } from './data';

type IPCInvokerKeys = keyof IPCInvokerInterface;
type IPCInvokerPath = {
    [KEY in keyof IPCInvokerInterface]: {
        [KEY2 in keyof IPCInvokerInterface[KEY]]: 0
    };
};

// 런타임 시점 참조를 위한 객체
const ipcInvokerPath = {
    general : {
        echo : 0,
        openBrowser : 0,
    },
    globalStorage : {
        get : 0,
        set : 0,
    },
    masterKey : {
        init : 0,
        reset : 0,
        recover : 0,
    },
    profiles : {
        create : 0,
        delete : 0,
        getIds : 0,
        getLast : 0,
        setLast : 0,
    },
    profile : {
        getChatAIModels : 0,
    },
    profileStorage : {
        get : 0,
        set : 0,
        getAsText : 0,
        setAsText : 0,
        getAsBinary : 0,
        setAsBinary : 0,
        verifyAsSecret : 0,
        setAsSecret : 0,
        removeAsSecret : 0,
    },
    profileSessions : {
        add : 0,
        remove : 0,
        undoRemoved : 0,
        reorder : 0,
        getIds : 0,
    },
    profileSession : {
        getFormValues : 0,
        setFormValues : 0,  
    },
    profileSessionStorage : {
        get : 0,
        set : 0,
    },
    profileSessionHistory : {
        get : 0,
        search : 0,
        getMessage : 0,
        delete : 0,
        deleteAll : 0,
    },
    profileRTs : {
        getTree : 0,
        updateTree : 0,
        add : 0,
        createUsingTemplate : 0,
        remove : 0,
        existsId : 0,
        generateId : 0,
        changeId : 0,
    },
    profileRT : {
        getMetadata : 0,
        setMetadata : 0,
        reflectMetadata : 0,

        getForms : 0,

        addNode : 0,
        removeNode : 0,
        updateNodeOption : 0,
        connectNode : 0,
        disconnectNode : 0,
    },
    profileRTStorage : {
        get : 0,
        set : 0,
    },
    profileRTPrompt : {
        getMetadata : 0,
        getName : 0,
        setName : 0,
        getVariableNames : 0,
        getVariables : 0,
        setVariables : 0,
        removeVariables : 0,
        getContents : 0,
        setContents : 0,
    },
    request : {
        requestRT : 0,
        abort : 0,
    },
} satisfies IPCInvokerPath;

const ipcInvokers:IPCInvokerInterface = Object.fromEntries(
    Object.entries(ipcInvokerPath).map(
        ([key1, category]) => [
            key1 as IPCInvokerKeys,
            Object.fromEntries(
                Object.entries(category).map(
                    ([key2, _])=>[
                        key2,
                        (...args: any) => ipcRenderer.invoke(`${key1}_${key2}`, ...args)
                    ],
                ) satisfies [ string, (...args: any) => Promise<any> ][],
            ) as Record<string, (...args: any) => Promise<any>>
        ] as [IPCInvokerKeys, Record<string, (...args: any) => Promise<any>>]
    ) as [IPCInvokerKeys, Record<string, (...args: any) => Promise<any>>][]
) as IPCInvokerInterface;

// listener 인터페이스
let bindId = 0;
const bindedListener = new Map<number, any>();
const ipcListeners:IPCListenerInterface = {
    addRequestListener : async (listener:(event:any, token:string, data:any)=>void) => {
        const index = bindId++;
        bindedListener.set(index, listener);

        ipcRenderer.on(IPCListenerPing.Request, listener);
        return [null, index];
    },
    removeRequestListener : async (bindId:number) => {
        const binded = bindedListener.get(bindId);
        if (binded) {
            ipcRenderer.off(IPCListenerPing.Request, binded);
            bindedListener.delete(bindId);
        }
        return [null];
    },
}

const ipcExports = {
    ...ipcInvokers,
    ...ipcListeners,
}

contextBridge.exposeInMainWorld('electron', ipcExports);
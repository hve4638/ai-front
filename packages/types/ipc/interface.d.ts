import './invokers';
import './listeners';
import './result';

declare global {
    type IPCInvokerInterface = {
        general: IPCInvokerGeneral;
        globalStorage: IPCInvokerGlobalStorage;
        masterKey: IPCInvokerMasterKey;

        profiles: IPCInvokerProfiles;
        profile: IPCInvokerProfile;
        profileStorage: IPCInvokerProfileStorage;
        profileSessions: IPCInvokerProfileSessions;
        profileSession: IPCInvokerProfileSession;
        profileSessionStorage: IPCInvokerProfileSessionStorage;
        profileSessionHistory: IPCInvokerProfileSessionHistory;

        profileRTs: IPCInvokerProfileRTs;
        profileRT: IPCInvokerProfileRT;
        profileRTStorage: IPCInvokerProfileRTStorage;
        profileRTPrompt: IPCInvokerProfileRTPrompt;

        request: IPCInvokerRequest;
    }

    type IPCListenerInterface = {
        addRequestListener(listener:(event:any, token:string, data:any)=>void): EResult<number>;
        removeRequestListener(bindId:number): ENoResult;
        // addDebugLogListener(message:string): EResult<number>;
        // removeRequestListener(message:string): EResult<number>;
    };
    
    type IPCInterface = IPCInvokerInterface & IPCListenerInterface;

    type IPCInvokerPath = {
        [KEY in keyof IPCInvokerInterface]: {
            [KEY2 in keyof IPCInvokerInterface[KEY]]: 0
        };
    };
}
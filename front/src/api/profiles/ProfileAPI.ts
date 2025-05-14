import SessionAPI from './SessionAPI';
import LocalAPI from '@/api/local';
import { IPCError } from '@/api/error';
import RTAPI from './RTAPI';

class ProfileAPI {
    #profileId:string;
    #sessionAPIs:Record<string, SessionAPI> = {};
    #rtAPIs:Record<string, RTAPI> = {};

    constructor(id:string) {
        this.#profileId = id;
    }

    static getMock() {
        const source = new ProfileAPI('--mock');
        const mock = {};
        const proto = Object.getPrototypeOf(source);
        Object.getOwnPropertyNames(proto).forEach(key => {
            if (key !== 'constructor' && typeof source[key] === 'function') {
                mock[key] = (...args:unknown[]) => undefined;
            }
        });
        mock['isMock'] = () => true;
    
        return mock as ProfileAPI;
    }
    
    get id() {
        return this.#profileId;
    }

    isMock() {
        return false;
    }

    async getChatAIModels() {
        return await LocalAPI.profile.getChatAIModels(this.#profileId);
    }

    set = async (accessorId:string, data:KeyValueInput) => await LocalAPI.profileStorage.set(this.#profileId, accessorId, data);
    get = async (accessorId:string, keys:string[]) => await LocalAPI.profileStorage.get(this.#profileId, accessorId, keys);
    getAsText = async (accessorId:string):Promise<string> => await LocalAPI.profileStorage.getAsText(this.#profileId, accessorId);
    setAsText = async (accessorId:string, contents:string) => await LocalAPI.profileStorage.setAsText(this.#profileId, accessorId, contents);
    getAsBinary = async (accessorId:string):Promise<Buffer> => await LocalAPI.profileStorage.getAsBinary(this.#profileId, accessorId);
    setAsBinary = async (accessorId:string, buffer:Buffer) => await LocalAPI.profileStorage.setAsBinary(this.#profileId, accessorId, buffer);
    verifyAsSecret = async (accessorId:string, keys:string[]) => await LocalAPI.profileStorage.verifyAsSecret(this.#profileId, accessorId, keys);
    setAsSecret = async (accessorId:string, data:KeyValueInput) => await LocalAPI.profileStorage.setAsSecret(this.#profileId, accessorId, data);
    removeAsSecret = async (accessorId:string, keys:string[]) => await LocalAPI.profileStorage.removeAsSecret(this.#profileId, accessorId, keys);
    
    storage = {
        /** @deprecated use `verifyAsSecret` instead */
        hasSecret : async (accessorId:string, keys:string[]) => await LocalAPI.profileStorage.verifyAsSecret(this.#profileId, accessorId, keys),
        /** @deprecated use `setAsSecret` instead */
        setSecret : async (accessorId:string, data:KeyValueInput) => await LocalAPI.profileStorage.setAsSecret(this.#profileId, accessorId, data),
        /** @deprecated use `removeAsSecret` instead */
        removeSecret : async (accessorId:string, keys:string[]) => await LocalAPI.profileStorage.removeAsSecret(this.#profileId, accessorId, keys),
    } as const;
    sessions = {
        getIds : async () => await LocalAPI.profileSessions.getIds(this.#profileId),
        add : async () => await LocalAPI.profileSessions.add(this.#profileId),
        remove : async (sessionId:string) => await LocalAPI.profileSessions.remove(this.#profileId, sessionId),
        reorder : async (sessions:string[]) => await LocalAPI.profileSessions.reorder(this.#profileId, sessions),
        undoRemoved : async () => await LocalAPI.profileSessions.undoRemoved(this.#profileId),
        
        /** @deprecated use `add` instead */
        create : async () => await LocalAPI.profileSessions.add(this.#profileId),
    } as const;
    rts = {
        getTree : async () => LocalAPI.profileRTs.getTree(this.#profileId),
        updateTree : async (tree:RTMetadataTree) => LocalAPI.profileRTs.updateTree(this.#profileId, tree),
        generateId : async () => LocalAPI.profileRTs.generateId(this.#profileId),
        add : async (metadata:RTMetadata) => LocalAPI.profileRTs.add(this.#profileId, metadata),
        remove : async (rtId:string) => LocalAPI.profileRTs.remove(this.#profileId, rtId),
        existsId : async (rtId:string) => LocalAPI.profileRTs.existsId(this.#profileId, rtId),
        changeId : async (oldId:string, newId:string) => LocalAPI.profileRTs.changeId(this.#profileId, oldId, newId),
        
        /** @deprecated use `existsId` instead */
        hasId : async (rtId:string) => LocalAPI.profileRTs.existsId(this.#profileId, rtId),
    } as const;
    
    
    session(sessionId:string):SessionAPI {
        if (!(sessionId in this.#sessionAPIs)) {
            this.#sessionAPIs[sessionId] = new SessionAPI(this.#profileId, sessionId);
        }
        return this.#sessionAPIs[sessionId] as SessionAPI;
    }
    rt(rtId:string):RTAPI {
        if (!(rtId in this.#rtAPIs)) {
            this.#rtAPIs[rtId] = new RTAPI(this.#profileId, rtId);
        }
        return this.#rtAPIs[rtId] as RTAPI;
    }


    /** @deprecated use `session` instead */
    getSessionAPI(sessionId:string):SessionAPI {
        if (!(sessionId in this.#sessionAPIs)) {
            this.#sessionAPIs[sessionId] = new SessionAPI(this.#profileId, sessionId);
        }
        return this.#sessionAPIs[sessionId] as SessionAPI;
    }
    /** @deprecated use `rt` instead */
    getRTAPI(rtId:string):RTAPI {
        if (!(rtId in this.#rtAPIs)) {
            this.#rtAPIs[rtId] = new RTAPI(this.#profileId, rtId);
        }
        return this.#rtAPIs[rtId] as RTAPI;
    }

}


export default ProfileAPI;
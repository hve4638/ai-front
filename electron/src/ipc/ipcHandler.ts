import * as utils from '../utils';

import Profiles from '../features/profiles';
import FetchContainer from '../features/fetch-container';
import Storage from '../features/storage';

export interface IPCDependencies {
    fetchContainer:FetchContainer,
    profiles:Profiles,
    globalStorage:Storage,
}

export function getIPCHandler({
    fetchContainer,
    profiles,
    globalStorage,
}:IPCDependencies):IPC_TYPES {
    const trottles = {};

    return {
        echo : async (message:string) => {
            console.log(message);
            
            return [null, message];
        },
        openBrowser : async (url:string) => {
            utils.openBrowser(url);
    
            return [null];
        },
        openPromptDirectory : async (profileName:string) => {
            throw new Error('Not implemented yet');
        },

        // Fetch 관련
        fetch : async (url:string, init:Object) => {
            const fetchId = fetchContainer.fetch(url, init);
            return [null, fetchId];
        },
        abortFetch : async (fetchId:number) => {
            fetchContainer.abort(fetchId);
            return [null];
        },
        getFetchResponse : async (fetchId:number) => {
            return [null, await fetchContainer.get(fetchId)];
        },

        // Prompt 관련
        loadRootPromptMetadata : async (profileName:string) => {
            throw new Error('Not implemented yet');
            // const profile = profiles.getProfile(profileName);
            // const metadata = profile.getTextAccessor('prompt:index.json');
            // return [null, metadata.read()];
        },
        loadModulePromptMetadata : async (profileName:string, moduleName:string) => {
            throw new Error('Not implemented yet');
            // const profile = profiles.getProfile(profileName);
            // const metadata = profile.getModulePromptMetdata(moduleName);
            // return [null, metadata];
        },
        loadPromptTemplate : async (profileName:string, moduleName:string, filename:string) => {
            throw new Error('Not implemented yet');
            // const profile = profiles.getProfile(profileName);
            // const template = profile.getPromptTemplate(moduleName, filename);
            // return [null, template];
        },

        // Global Storage 관련
        loadGlobalValue : async (identifier:string, key:string) => {
            const accessor = globalStorage.getJSONAccessor(identifier);

            return [null, accessor.get(key)];
        },
        storeGlobalValue : async (identifier:string, key:string, value:any) => {
            const accessor = globalStorage.getJSONAccessor(identifier);

            accessor.set(key, value);
            return [null];
        },

        // Profile 관련
        getProfileNames : async () => {
            return [null, profiles.getProfileNames()];
        },
        createProfile : async (profileName:string) => {
            profiles.createProfile(profileName);
            return [null];
        },
        deleteProfile : async (profileName:string) => {
            profiles.deleteProfile(profileName);
            return [null];
        },

        // Profile Storage 관련
        loadProfileValue : async (profileName:string, identifier:string, key:string) => {
            const profile = profiles.getProfile(profileName);
            const accessor = profile.getJSONAccessor(identifier);
            return [null, accessor.get(key)];
        },
        storeProfileValue : async (profileName:string, identifier:string, key:string, value:any) => {
            trottles[identifier] ??= utils.throttle(500);

            const profile = profiles.getProfile(profileName);
            const accessor = profile.getJSONAccessor(identifier);
            accessor.set(key, value);

            // 500ms throttle로 저장
            trottles[identifier](()=>{
                profile.save();
            });

            return [null];
        },

        // Profile History 관련
        loadProfileHistoryCount : async (profileName:string, historyName:string) => {
            throw new Error('Not implemented yet');
        },
        loadProfileHistory : async (profileName:string, historyName:string, offset, limit) => {
            const profile = profiles.getProfile(profileName);
            const accessor = profile.getHistoryAccessor(historyName);
            
            return [null, accessor.get(offset, limit)];
        },
        storeProfileHistory : async (profileName:string, historyName:string, data:any) => {
            const profile = profiles.getProfile(profileName);
            const accessor = profile.getHistoryAccessor(historyName);
            accessor.append('NORMAL', data);

            return [null];
        },
        deleteProfileHistory : async (profileName:string, historyName:string, id:number) => {
            const profile = profiles.getProfile(profileName);
            const accessor = profile.getHistoryAccessor(historyName);
            accessor.delete(id);

            return [null];
        },
        deleteAllProfileHistory : async (profileName:string, historyName:string) => {
            const profile = profiles.getProfile(profileName);
            const accessor = profile.getHistoryAccessor(historyName);
            accessor.deleteAll();

            return [null];
        },

        // Last Profile 관련
        setLastProfileName : async (profileName:string) => {
            const accessor = globalStorage.getJSONAccessor('cache');
            accessor.set('last_profile_name', profileName);
            return [null];
        },
        getLastProfileName : async () => {
            const accessor = globalStorage.getJSONAccessor('cache');
            return [null, accessor.get('last_profile_name')];
        },

        // Log 관련
        writeLog : async (name:string, message:string, showDatetime:boolean) => {
            throw new Error('Not implemented yet');
        },
        
    }
}

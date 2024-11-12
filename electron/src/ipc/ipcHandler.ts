import * as utils from '../utils';

import Profiles from '../features/profiles';
import FetchContainer from '../features/fetch-container';
import GlobalStorage from '../features/global-storage';

export interface IPCDependencies {
    fetchContainer:FetchContainer,
    profiles:Profiles,
    globalStorage:GlobalStorage,
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
            const profile = profiles.getProfile(profileName);
            const metadata = profile.getRootPromptMetadata();
            return [null, metadata];
        },
        loadModulePromptMetadata : async (profileName:string, moduleName:string) => {
            const profile = profiles.getProfile(profileName);
            const metadata = profile.getModulePromptMetdata(moduleName);
            return [null, metadata];
        },
        loadPromptTemplate : async (profileName:string, moduleName:string, filename:string) => {
            const profile = profiles.getProfile(profileName);
            const template = profile.getPromptTemplate(moduleName, filename);
            return [null, template];
        },

        // Global Storage 관련
        loadGlobalValue : async (storageName:string, key:string) => {
            return [null, globalStorage.getValue(storageName, key)];
        },
        storeGlobalValue : async (storageName:string, key:string, value:any) => {
            globalStorage.setValue(storageName, key, value);
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
        loadProfileValue : async (profileName:string, storageName:string, key:string) => {
            const profile = profiles.getProfile(profileName);
            const value = profile.getValue(storageName, key);
            return [null, value];
        },
        storeProfileValue : async (profileName:string, storageName:string, key:string, value:any) => {
            trottles[storageName] ??= utils.throttle(500);

            const profile = profiles.getProfile(profileName);
            profile.setValue(storageName, key, value);

            // 500ms throttle로 저장
            trottles[storageName](()=>{
                profile.save();
            })
            return [null];
        },

        // Profile History 관련
        loadProfileHistoryCount : async (profileName:string, historyName:string) => {
            throw new Error('Not implemented yet');
        },
        loadProfileHistory : async (profileName:string, historyName:string, offset, limit) => {
            const profile = profiles.getProfile(profileName);
            const data = profile.history?.get(historyName, offset, limit);

            return [null, data];
        },
        storeProfileHistory : async (profileName:string, historyName:string, data:any) => {
            const profile = profiles.getProfile(profileName);
            profile.history.append(historyName, data);

            return [null];
        },
        deleteProfileHistory : async (profileName:string, historyName:string, id:number) => {
            const profile = profiles.getProfile(profileName);
            profile.history.delete(historyName, id);

            return [null];
        },
        deleteAllProfileHistory : async (profileName:string, historyName:string) => {
            const profile = profiles.getProfile(profileName);
            profile.history.drop(historyName);

            return [null];
        },

        // Last Profile 관련
        setLastProfileName : async (profileName:string) => {
            globalStorage.setValue('cache', 'lastProfileName', profileName);
            return [null];
        },
        getLastProfileName : async () => {
            return [null, globalStorage.getValue('cache', 'lastProfileName')];
        },

        // Log 관련
        writeLog : async (name:string, message:string, showDatetime:boolean) => {
            throw new Error('Not implemented yet');
        }
    }
}

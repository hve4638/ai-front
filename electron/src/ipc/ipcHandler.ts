import * as utils from '@utils';

import { type FSStorage } from '@hve/fs-storage';

import type Profiles from '@features/profiles';
import type FetchContainer from '@features/fetch-container';
import type UniqueKeyManager from '@features/unique-key';
import type Profile from '@features/profiles/Profile/Profile';
import ChatAIModels from '@features/chatai-models';

function debugLog(...args:any[]) {
    console.log('[IPC]', ...args);
}

export interface IPCDependencies {
    fetchContainer:FetchContainer;
    profiles:Profiles;
    globalStorage:FSStorage;
    uniqueKeyManager:UniqueKeyManager;
}

export function getIPCHandler({
    fetchContainer,
    profiles,
    globalStorage,
    uniqueKeyManager,
}:IPCDependencies):IPC_TYPES {
    const throttles = {};

    const saveProfile = (profile:Profile) => {
        const throttleId = `profile_${profile.path}`;
        throttles[throttleId] ??= utils.throttle(500);
        throttles[throttleId](()=>{
            profile.commit();
        });
    }

    return {
        echo : async (message:string) => {
            console.log(message);

            return [null, message];
        },
        openBrowser : async (url:string) => {
            utils.openBrowser(url);
            
            return [null];
        },
        getChatAIModels : async () => {
            return [null, ChatAIModels.models]
        },

        /* 마스터키 */
        initMasterKey : async () => {
            await uniqueKeyManager.readKey();

            return [null];
        },
        isMasterKeyExists : async () => {
            return [null, uniqueKeyManager.existsKey()];
        }, 
        validateMasterKey : async () => {
            const key = uniqueKeyManager.getKey();

            return [null, key !== null];
        },
        generateMasterKey : async (recoveryKey:string) => {
            await uniqueKeyManager.generateKey(recoveryKey);
            return [null];
        },
        resetMasterKey : async () => {
            uniqueKeyManager.resetKey();
            return [null];
        },
        recoverMasterKey : async (recoveryKey:string) => {
            const success = await uniqueKeyManager.tryRecoveryKey(recoveryKey);
            return [null, success];
        },

        /* 전역 스토리지 */
        getGlobalData : async (identifier:string, key:string) => {
            const accessor = globalStorage.getJSONAccessor(identifier);

            return [null, accessor.get(key)];
        },
        setGlobalData : async (identifier:string, key:string, value:any) => {
            const accessor = globalStorage.getJSONAccessor(identifier);

            accessor.set(key, value);
            return [null];
        },

        /* 프로필 */
        createProfile : async () => {
            const identifier = profiles.createProfile();
            
            throttles['profiles'] ??= utils.throttle(500);
            throttles['profiles'](()=>{
                profiles.saveAll();
            });

            return [null, identifier];
        },
        deleteProfile : async (profileName:string) => {
            profiles.deleteProfile(profileName);
            return [null];
        },

        /* 프로필 목록 */
        getProfileList : async () => {
            const ids = profiles.getProfileIDs();

            return [null, ids];
        },
        getLastProfile : async () => {
            const ids = profiles.getLastProfileId();

            return [null, ids];
        },
        setLastProfile : async (id:string|null) => {
            profiles.setLastProfileId(id);

            return [null];
        },

        /* 프로필 저장소 */
        getProfileData : async (profileId:string, id:string, key:string) => {
            console.log('[getProfileData]', profileId, id, key);

            const profile = profiles.getProfile(profileId);
            const accessor = profile.getJSONAccessor(id);
            return [null, accessor.get(key)];
        },
        setProfileData : async (profileId:string, id:string, key:string, value:any) => {
            console.log('[setProfileData]', profileId, id, key, value);

            const profile = profiles.getProfile(profileId);
            const accessor = profile.getJSONAccessor(id);
            accessor.set(key, value);

            throttles[profileId] ??= utils.throttle(500);

            // 500ms throttle로 저장
            throttles[profileId](()=>{
                profile.commit();
            });

            return [null];
        },
        getProfileDataAsText : async (profileId:string, id:string) => {
            const profile = profiles.getProfile(profileId);
            const accessor = profile.getTextAccessor(id);
            return [null, accessor.read()];
        },
        setProfileDataAsText : async (profileId:string, id:string, value:any) => {
            const profile = profiles.getProfile(profileId);
            const accessor = profile.getTextAccessor(id);
            accessor.write(value);

            return [null];
        },
        getProfileDataAsBinary : async (profileId:string, id:string) => {
            const profile = profiles.getProfile(profileId);
            const accessor = profile.getBinaryAccessor(id);
            return [null, accessor.read()];
        },
        setProfileDataAsBinary : async (profileId:string, id:string, content:Buffer) => {
            const profile = profiles.getProfile(profileId);
            const accessor = profile.getBinaryAccessor(id);
            accessor.write(content);

            return [null];
        },

        /* 프로필 RT */
        getProfileRTTree : async (profileId:string) => {
            const profile = profiles.getProfile(profileId);
            const tree = profile.getRTTree();

            return [null, tree];
        },
        updateProfileRTTree : async (profileId:string, tree:any) => {
            const profile = profiles.getProfile(profileId);
            profile.updateRTTree(tree);
            saveProfile(profile);

            return [null];
        },
        addProfileRT : async (profileId:string, metadata:RTMetadata) => {
            const profile = profiles.getProfile(profileId);
            profile.addRT(metadata);
            saveProfile(profile);

            return [null];
        },
        removeProfileRT : async (profileId:string, promptId:string) => {
            const profile = profiles.getProfile(profileId);
            profile.removeRT(promptId);
            saveProfile(profile);

            return [null];
        },
        getProfileRTMode : async (profileId:string, rtId:string) => {
            const profile = profiles.getProfile(profileId);
            const mode = profile.getRTMode(rtId);

            return [null, mode];
        },
        setProfileRTMode : async (profileId:string, rtId:string, mode:RTMode) => {
            const profile = profiles.getProfile(profileId);
            profile.setRTMode(rtId, mode);
            saveProfile(profile);

            return [null];
        },
        getProfileRTPromptText : async (profileId:string, rtId:string) => {
            const profile = profiles.getProfile(profileId);
            const prompt = profile.getRTPromptText(rtId);

            return [null, prompt];
        },
        setProfileRTPromptText : async (profileId:string, rtId:string, promptText:string) => {
            const profile = profiles.getProfile(profileId);
            profile.setRTPromptText(rtId, promptText);

            return [null];
        },

        /* 프로필 세션 */
        addProfileSession : async (profileId:string) => {
            const profile = profiles.getProfile(profileId);
            const sid = profile.createSession();

            saveProfile(profile);
            return [null, sid];
        },
        removeProfileSession : async (profileId:string, sessionId:string) => { 
            const profile = profiles.getProfile(profileId);
            profile.removeSession(sessionId);

            const throttleId = `profile_${profileId}`;
            throttles[throttleId] ??= utils.throttle(500);
            throttles[throttleId](()=>{
                profile.commit();
            });

            return [null];
        },
        undoRemoveProfileSession : async (profileId:string) => {
            const profile = profiles.getProfile(profileId);
            const sid = profile.undoRemoveSession();

            const throttleId = `profile_${profileId}`;
            throttles[throttleId] ??= utils.throttle(500);
            throttles[throttleId](()=>{
                profile.commit();
            });

            if (sid == null) {
                return [new Error('No session to undo')];
            }
            else {
                return [null, sid];
            }
        },
        reorderProfileSessions : async (profileId:string, newTabs:string[]) => {
            const profile = profiles.getProfile(profileId);
            profile.reorderSessions(newTabs);

            const throttleId = `profile_${profileId}`;
            throttles[throttleId] ??= utils.throttle(500);
            throttles[throttleId](()=>{
                profile.commit();
            });
            
            return [null];
        },
        getProfileSessionIds : async (profileId:string) => {
            const profile = profiles.getProfile(profileId);
            const sessions = profile.getSessionIds();

            return [null, sessions];
        },

        /* 프로필 세션 저장소 */
        getProfileSessionData : async (profileId:string, sessionId:string, id:string, key:string) => {
            console.log('[getProfileSessionData]', profileId, sessionId, id, key);

            const profile = profiles.getProfile(profileId);
            const accessor = profile.getJSONAccessor(`session:${sessionId}:${id}`);
            
            return [null, accessor.get(key)];
        },
        setProfileSessionData : async (profileId:string, sessionId:string, accessId:string, key:string, value:any) => {
            console.log('[setProfileSessionData]', profileId, sessionId, accessId, key, value);

            const profile = profiles.getProfile(profileId);
            const accessor = profile.getJSONAccessor(`session:${sessionId}:${accessId}`);
            
            accessor.set(key, value);
            throttles['profiles'] ??= utils.throttle(500);
            throttles['profiles'](()=>{
                profiles.saveAll();
            });

            return [null];
        },
        
        /* 프로필 세션 히스토리 */
        getProfileSessionHistory : async (profileId:string, sessionId:string, condition:HistoryCondition) => {
            const profile = profiles.getProfile(profileId);
            const accessor = profile.getHistoryAccessor(sessionId);

            const {
                offset = 0,
                limit = 10,
                date_begin,
                date_end,
                desc,
                flag,
            } = condition;
            return [null, accessor.get(offset, limit)];
        },
        addProfileSessionHistory : async (profileId:string, sessionId:string, history:any) => {
            const profile = profiles.getProfile(profileId);
            const accessor = profile.getHistoryAccessor(sessionId);

            //accessor.add(history);

            return [null];
        },
        deleteProfileSessionHistory : async (profileId:string, sessionId:string, historyKey:number) => {
            const profile = profiles.getProfile(profileId);
            const accessor = profile.getHistoryAccessor(sessionId);

            accessor.delete(historyKey);

            return [null];
        },
        deleteAllProfileSessionHistory : async (profileId:string, sessionId:string) => {
            const profile = profiles.getProfile(profileId);
            const accessor = profile.getHistoryAccessor(sessionId);

            accessor.deleteAll();

            return [null];
        },
    }
}

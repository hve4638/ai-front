import type { ILocalAPI } from './interface';

const electron = window.electron;

class IPCError extends Error {
    constructor(message:string) {
        super(message);
        this.name = 'IPCError';
    }
}

class ElectronIPCAPI implements ILocalAPI {
    async echo(message:any) {
        const [_, data] = await electron.echo(message);
        return data;
    }
    async openBrowser(url:string) {
        await electron.openBrowser(url);
    }
    async getChatAIModels() {
        const [err, models] = await electron.getChatAIModels();
        if (err) throw new IPCError(err.message);

        return models;
    }

    async initMasterKey() {
        const [err] = await electron.initMasterKey();
        if (err) throw new IPCError(err.message);
    }
    async isMasterKeyExists() {
        const [err, exists] = await electron.isMasterKeyExists();
        if (err) throw new IPCError(err.message);
        return exists;
    }
    async validateMasterKey() {
        const [err, isValid] = await electron.validateMasterKey();
        if (err) throw new IPCError(err.message);
        return isValid;
    }
    async generateMasterKey(recoveryKey: string) {
        const [err] = await electron.generateMasterKey(recoveryKey);
        if (err) throw new IPCError(err.message);
    }
    async resetMasterKey() {
        const [err] = await electron.resetMasterKey();
        if (err) throw new IPCError(err.message);
    }
    async recoverMasterKey(recoveryKey: string) {
        const [err, success] = await electron.recoverMasterKey(recoveryKey);
        if (err) throw new IPCError(err.message);
        return success;
    }


    /* 전역 저장소 */
    async getGlobalData(storageName:string, key:string) {
        const [err, data] = await electron.getGlobalData(storageName, key);
        if (err) throw new IPCError(err.message);
        return data;
    }
    async setGlobalData(storageName:string, key:string, data:any) {
        const [err] = await electron.setGlobalData(storageName, key, data);
        if (err) throw new IPCError(err.message);
    }

    /* 프로필 */
    async createProfile() {
        const [err, id] = await electron.createProfile();
        if (err) throw new IPCError(err.message);
        return id;
    }
    async deleteProfile(id:string) {
       const [err] = await electron.deleteProfile(id);
       if (err) throw new IPCError(err.message);
   }

   /* 프로필 목록 */
   async getProfileList() {
       const [err, profiles] = await electron.getProfileList();
       if (err) throw new IPCError(err.message);

       return profiles;
   }
   async getLastProfile() {
         const [err, profile] = await electron.getLastProfile();
         if (err) throw new IPCError(err.message);
    
         return profile;
   }
   async setLastProfile(id:string|null) {
        const [err] = await electron.setLastProfile(id);
        if (err) throw new IPCError(err.message);
   }

    /* 프로필 저장소 */
    async getProfileData(profileId:string, accessor:string, key:string) {
        const [err, data] = await electron.getProfileData(profileId, accessor, key);
        if (err) throw new IPCError(err.message);

        return data;
    }
    async setProfileData(profileId:string, accessor:string, key:string, data:any) {
        const [err] = await electron.setProfileData(profileId, accessor, key, data);
        if (err) throw new IPCError(err.message);
    }
    async getProfileDataAsText(profileId:string, accessor:string) {
        const [err, data] = await electron.getProfileDataAsText(profileId, accessor);
        if (err) throw new IPCError(err.message);

        return data;
    }
    async setProfileDataAsText(profileId:string, accessor:string, data:string) {
        const [err] = await electron.setProfileDataAsText(profileId, accessor, data);
        if (err) throw new IPCError(err.message);
    }
    async getProfileDataAsBinary(profileId:string, accessor:string) {
        const [err, data] = await electron.getProfileDataAsBinary(profileId, accessor);
        if (err) throw new IPCError(err.message);

        return data;
    }
    async setProfileDataAsBinary(profileId:string, accessor:string, data:Buffer) {
        const [err] = await electron.setProfileDataAsBinary(profileId, accessor, data);
        if (err) throw new IPCError(err.message);
    }

    /* 프로필 세션 */
    async addProfileSession(profileId:string) {
        const [err, sid] = await electron.addProfileSession(profileId);
        if (err) throw new IPCError(err.message);
        return sid;
    }
    async removeProfileSession(profileId:string, sessionId:string) {
        const [err] = await electron.removeProfileSession(profileId, sessionId);
        if (err) throw new IPCError(err.message);
    }
    async getProfileSessionIds(profileId:string) {
        const [err, tabs] = await electron.getProfileSessionIds(profileId);
        if (err) throw new IPCError(err.message);

        return tabs;
    }
    async reorderProfileSessions(profileId:string, tabs:string[]) {
        const [err] = await electron.reorderProfileSessions(profileId, tabs);
        if (err) throw new IPCError(err.message);
    }
    async undoRemoveProfileSession(profileId:string) {
        const [err, sid] = await electron.undoRemoveProfileSession(profileId);
        if (err) throw new IPCError(err.message);

        return sid;
    }

    /* 프로필 세션 저장소 */
    async getProfileSessionData(profileId:string, sessionId:string, accessor:string, key:string) {
        console.log("[IPC] getProfileSessionData", profileId, sessionId, accessor, key);
        const [err, data] = await electron.getProfileSessionData(profileId, sessionId, accessor, key);
        if (err) throw new IPCError(err.message);
        
        return data;
    }
    async setProfileSessionData(profileId:string, sessionId:string, accessor:string, key:string, data:any) {
        const [err] = await electron.setProfileSessionData(profileId, sessionId, accessor, key, data);
        if (err) throw new IPCError(err.message);
    }

    /* 프로필 세션 히스토리 */
    async getProfileSessionHistory(profileId:string, sessionId:string, condition:any) {
        const [err, history] = await electron.getProfileSessionHistory(profileId, sessionId, condition);
        if (err) throw new IPCError(err.message);

        return history;
    }
    async addProfileSessionHistory(profileId:string, sessionId:string, history:any) {
        const [err] = await electron.addProfileSessionHistory(profileId, sessionId, history);
        if (err) throw new IPCError(err.message);
    }
    async deleteProfileSessionHistory(profileId:string, sessionId:string, historyKey:number) {
        const [err] = await electron.deleteProfileSessionHistory(profileId, sessionId, historyKey);
        if (err) throw new IPCError(err.message);
    }
    async deleteAllProfileSessionHistory(profileId:string, sessionId:string) {
        const [err] = await electron.deleteAllProfileSessionHistory(profileId, sessionId);
        if (err) throw new IPCError(err.message);
    }
}

export default ElectronIPCAPI;
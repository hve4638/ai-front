import type { ILocalAPI } from './interface';

const electron = window.electron;

class IPCError extends Error {
    constructor(message:string) {
        super(message);
        this.name = 'IPCError';
    }
}

class ElectronIPCAPI {
    async echo(message:any) {
        const [_, data] = await electron.Echo(message);
        return data;
    }
    async openBrowser(url:string) {
        await electron.OpenBrowser(url);
    }
    async getChatAIModels() {
        const [err, models] = await electron.GetChatAIModels();
        if (err) throw new IPCError(err.message);

        return models;
    }

    async initMasterKey() {
        const [err] = await electron.InitMasterKey();
        if (err) throw new IPCError(err.message);
    }
    async isMasterKeyExists() {
        const [err, exists] = await electron.CheckMasterKeyExistence();
        if (err) throw new IPCError(err.message);
        return exists;
    }
    async validateMasterKey() {
        const [err, isValid] = await electron.ValidateMasterKey();
        if (err) throw new IPCError(err.message);
        return isValid;
    }
    async generateMasterKey(recoveryKey: string) {
        const [err] = await electron.GenerateMasterKey(recoveryKey);
        if (err) throw new IPCError(err.message);
    }
    async resetMasterKey() {
        const [err] = await electron.ResetMasterKey();
        if (err) throw new IPCError(err.message);
    }
    async recoverMasterKey(recoveryKey: string) {
        const [err, success] = await electron.RecoverMasterKey(recoveryKey);
        if (err) throw new IPCError(err.message);
        return success;
    }


    /* 전역 저장소 */
    async getGlobalData(storageName:string, key:string) {
        const [err, data] = await electron.GetGlobalData(storageName, key);
        if (err) throw new IPCError(err.message);
        return data;
    }
    async setGlobalData(storageName:string, key:string, data:any) {
        const [err] = await electron.SetGlobalData(storageName, key, data);
        if (err) throw new IPCError(err.message);
    }

    /* 프로필 */
    async createProfile() {
        const [err, id] = await electron.CreateProfile();
        if (err) throw new IPCError(err.message);
        return id;
    }
    async deleteProfile(id:string) {
       const [err] = await electron.DeleteProfile(id);
       if (err) throw new IPCError(err.message);
   }

   /* 프로필 목록 */
   async getProfileList() {
       const [err, profiles] = await electron.GetProfileList();
       if (err) throw new IPCError(err.message);

       return profiles;
   }
   async getLastProfile() {
         const [err, profile] = await electron.GetLastProfile();
         if (err) throw new IPCError(err.message);
    
         return profile;
   }
   async setLastProfile(id:string|null) {
        const [err] = await electron.SetLastProfile(id);
        if (err) throw new IPCError(err.message);
   }

    /* 프로필 저장소 */
    async getProfileData(profileId:string, accessor:string, key:string) {
        const [err, data] = await electron.GetProfileData(profileId, accessor, key);
        if (err) throw new IPCError(err.message);

        return data;
    }
    async setProfileData(profileId:string, accessor:string, key:string, data:any) {
        const [err] = await electron.SetProfileData(profileId, accessor, key, data);
        if (err) throw new IPCError(err.message);
    }
    async getProfileDataAsText(profileId:string, accessor:string) {
        const [err, data] = await electron.GetProfileDataAsText(profileId, accessor);
        if (err) throw new IPCError(err.message);

        return data;
    }
    async setProfileDataAsText(profileId:string, accessor:string, data:string) {
        const [err] = await electron.SetProfileDataAsText(profileId, accessor, data);
        if (err) throw new IPCError(err.message);
    }
    async getProfileDataAsBinary(profileId:string, accessor:string) {
        const [err, data] = await electron.GetProfileDataAsBinary(profileId, accessor);
        if (err) throw new IPCError(err.message);

        return data;
    }
    async setProfileDataAsBinary(profileId:string, accessor:string, data:Buffer) {
        const [err] = await electron.SetProfileDataAsBinary(profileId, accessor, data);
        if (err) throw new IPCError(err.message);
    }

    /* 프로필 RT */
    async getProfileRTTree(profileId:string):Promise<RTMetadataTree> {
        const [err, tree] = await electron.GetProfileRTTree(profileId);
        if (err) throw new IPCError(err.message);
        return tree;
    }
    async updateProfileRTTree(profileId:string, tree:RTMetadataTree) {
        const [err] = await electron.UpdateProfileRTTree(profileId, tree);
        if (err) throw new IPCError(err.message);
    }
    async addProfileRT(profileId:string, rt:any) {
        const [err] = await electron.AddProfileRT(profileId, rt);
        if (err) throw new IPCError(err.message);
    }
    async removeProfileRT(profileId:string, rtId:string) {
        const [err] = await electron.RemoveProfileRT(profileId, rtId);
        if (err) throw new IPCError(err.message);
    }
    async getProfileRTMode(profileId:string, rtId:string):Promise<RTMode> {
        const [err, mode] = await electron.GetProfileRTMode(profileId, rtId);
        if (err) throw new IPCError(err.message);
        return mode;
    }
    async setProfileRTMode(profileId:string, rtId:string, mode:RTMode) {
        const [err] = await electron.SetProfileRTMode(profileId, rtId, mode);
        if (err) throw new IPCError(err.message);
    }
    async getProfileRTPromptData(profileId:string, rtId:string, promptId:string):Promise<RTPromptData> {
        const [err, promptText] = await electron.GetProfileRTPromptData(profileId, rtId, promptId);
        if (err) throw new IPCError(err.message);
        return promptText;
    }
    async setProfileRTPromptData(profileId:string, rtId:string, data:RTPromptData) {
        const [err] = await electron.SetProfileRTPromptData(profileId, rtId, promptText);
        if (err) throw new IPCError(err.message);
    }
    async hasProfileRTId(profileId:string, rtId:string):Promise<boolean> {
        const [err, exists] = await electron.HasProfileRTId(profileId, rtId);
        if (err) throw new IPCError(err.message);
        return exists;
    }
    async generateProfileRTId(profileId:string):Promise<string> {
        const [err, rtId] = await electron.GenerateProfileRTId(profileId);
        if (err) throw new IPCError(err.message);
        return rtId;
    }
    async changeProfileRTId(profileId:string, oldId:string, newId:string) {
        const [err] = await electron.ChangeProfileRTId(profileId, oldId, newId);
        if (err) throw new IPCError(err.message);
    }

    /* 프로필 세션 */
    async addProfileSession(profileId:string) {
        const [err, sid] = await electron.AddProfileSession(profileId);
        if (err) throw new IPCError(err.message);
        return sid;
    }
    async removeProfileSession(profileId:string, sessionId:string) {
        const [err] = await electron.RemoveProfileSession(profileId, sessionId);
        if (err) throw new IPCError(err.message);
    }
    async getProfileSessionIds(profileId:string) {
        const [err, tabs] = await electron.GetProfileSessionIds(profileId);
        if (err) throw new IPCError(err.message);

        return tabs;
    }
    async reorderProfileSessions(profileId:string, tabs:string[]) {
        const [err] = await electron.ReorderProfileSessions(profileId, tabs);
        if (err) throw new IPCError(err.message);
    }
    async undoRemoveProfileSession(profileId:string) {
        const [err, sid] = await electron.UndoRemoveProfileSession(profileId);
        if (err) throw new IPCError(err.message);

        return sid;
    }

    /* 프로필 세션 저장소 */
    async getProfileSessionData(profileId:string, sessionId:string, accessor:string, key:string) {
        console.log("[IPC] getProfileSessionData", profileId, sessionId, accessor, key);
        const [err, data] = await electron.GetProfileSessionData(profileId, sessionId, accessor, key);
        if (err) throw new IPCError(err.message);
        
        return data;
    }
    async setProfileSessionData(profileId:string, sessionId:string, accessor:string, key:string, data:any) {
        const [err] = await electron.SetProfileSessionData(profileId, sessionId, accessor, key, data);
        if (err) throw new IPCError(err.message);
    }

    /* 프로필 세션 히스토리 */
    async getProfileSessionHistory(profileId:string, sessionId:string, condition:any) {
        const [err, history] = await electron.GetProfileSessionHistory(profileId, sessionId, condition);
        if (err) throw new IPCError(err.message);

        return history;
    }
    async addProfileSessionHistory(profileId:string, sessionId:string, history:any) {
        const [err] = await electron.AddProfileSessionHistory(profileId, sessionId, history);
        if (err) throw new IPCError(err.message);
    }
    async deleteProfileSessionHistory(profileId:string, sessionId:string, historyKey:number) {
        const [err] = await electron.DeleteProfileSessionHistory(profileId, sessionId, historyKey);
        if (err) throw new IPCError(err.message);
    }
    async deleteAllProfileSessionHistory(profileId:string, sessionId:string) {
        const [err] = await electron.DeleteAllProfileSessionHistory(profileId, sessionId);
        if (err) throw new IPCError(err.message);
    }
}

export default ElectronIPCAPI;
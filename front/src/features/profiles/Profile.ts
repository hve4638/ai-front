import LocalAPI from 'api/local';
import ProfileSession from './ProfileSession';
import type { IProfile, IProfileSession } from './types';

class Profile implements IProfile {
    #id:string;
    #name:string = 'UNKNOWN';
    #color:string = '';
    #sessions:Map<string, ProfileSession> = new Map();

    constructor(id:string) {
        this.#id = id;
    }

    async loadMetadata() {
        this.#name = await LocalAPI.getProfileData(this.#id, 'config', 'name');
        this.#color = await LocalAPI.getProfileData(this.#id, 'config', 'color');
    }

    async setData(accessor:string, key:string, value:any) {
        await LocalAPI.setProfileData(this.#id, accessor, key, value);
    }

    async getData(accessor:string, key:string) {
        return await LocalAPI.getProfileData(this.#id, accessor, key);
    }
    
    get name() {
        return this.#name;
    }
    get color() {
        return this.#color;
    }
    set name(value:string) {
        LocalAPI.setProfileData(this.#id, 'config', 'name', value);
        this.#name = value;
    }
    set color(value:string) {
        LocalAPI.setProfileData(this.#id, 'config', 'color', value);
        this.#color = value;
    }

    getSession(sessionId:string):IProfileSession {
        if (!this.#sessions.has(sessionId)) {
            this.#sessions.set(sessionId, new ProfileSession(this.#id, sessionId));
        }
        return this.#sessions.get(sessionId) as ProfileSession;
    }
    async createSession() {
        return await LocalAPI.addProfileSession(this.#id);
    }
    async removeSession(sessionId:string) {
        return await LocalAPI.removeProfileSession(this.#id, sessionId);
    }
    async reorderSessions(sessions:string[]) {
        return await LocalAPI.reorderProfileSessions(this.#id, sessions);
    }
    async getSessionIds() {
        return await LocalAPI.getProfileSessionIds(this.#id);
    }
    async undoRemoveSession() {
        return await LocalAPI.undoRemoveProfileSession(this.#id);
    }

    /* RT */
    async getRTTree() {
        return await LocalAPI.getProfileRTTree(this.#id);
    }
    async updateRTTree(tree:RTMetadataTree) {
        await LocalAPI.updateProfileRTTree(this.#id, tree);
    }
    async addRT(metadata:RTMetadata) {
        await LocalAPI.addProfileRT(this.#id, metadata);
    }
    async removeRT(rtId:string) {
        await LocalAPI.removeProfileRT(this.#id, rtId);
    }
    async getRTMode(rtId:string) {
        return await LocalAPI.getProfileRTMode(this.#id, rtId);
    }
    async setRTMode(rtId:string, mode:RTMode) {
        await LocalAPI.setProfileRTMode(this.#id, rtId, mode);
    }
    async getRTPromptText(rtId:string) {
        return await LocalAPI.getProfileRTPromptText(this.#id, rtId);
    }
    async setRTPromptText(rtId:string, promptText:string) {
        await LocalAPI.setProfileRTPromptText(this.#id, rtId, promptText);
    }
}


export default Profile;
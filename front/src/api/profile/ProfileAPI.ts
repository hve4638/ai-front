import LocalAPI from 'api/local';
import ProfileSessionAPI from './SessionAPI';
import type { IProfileSession } from './types';
import { IPCError } from 'api/error';

class ProfileAPI {
    #id:string;
    #name:string = 'UNKNOWN';
    #color:string = '';
    #sessions:Map<string, ProfileSessionAPI> = new Map();

    constructor(id:string) {
        this.#id = id;
    }

    async loadMetadata() {
        const {
            name,
            color
        } = await LocalAPI.getProfileData(this.#id, 'config.json', ['name', 'color']);
        this.#name = name;
        this.#color = color;
    }

    async setData(accessor:string, key:string, value:any) {
        await LocalAPI.setProfileData(this.#id, accessor, [[key, value]]);
    }

    async getData(accessor:string, key:string) {
        return await LocalAPI.getProfileData(this.#id, accessor, [key]);
    }
    
    get name() {
        return this.#name;
    }
    get color() {
        return this.#color;
    }
    set name(value:string) {
        LocalAPI.setProfileData(this.#id, 'config.json', [['name', value]]);
        this.#name = value;
    }
    set color(value:string) {
        LocalAPI.setProfileData(this.#id, 'config.json', [['color', value]]);
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
    async getProfileRTTree(profileId:string):Promise<RTMetadataTree> {
        const [err, tree] = await window.electron.GetProfileRTTree(profileId);
        if (err) throw new IPCError(err.message);
        return tree;
    }
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
    async hasRTId(rtId:string) {
        return await LocalAPI.hasProfileRTId(this.#id, rtId);
    }
    async generateRTId() {
        return await LocalAPI.generateProfileRTId(this.#id);
    }
    async changeRTId(oldId:string, newId:string) {
        await LocalAPI.changeProfileRTId(this.#id, oldId, newId);
    }
}


export default ProfileAPI;
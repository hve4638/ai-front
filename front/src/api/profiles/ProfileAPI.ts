import SessionAPI from './SessionAPI';
import { IPCError } from 'api/error';
import RTAPI from './RTAPI';

const electron = window.electron;

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

    /* get/set JSON */
    async set(accessorId:string, data:KeyValueInput) {
        const [err] = await electron.SetProfileData(this.#profileId, accessorId, data);
        if (err) throw new IPCError(err.message);
    }
    
    async get(accessorId:string, keys:string[]) {
        const [err, result] = await electron.GetProfileData(this.#profileId, accessorId, keys);
        if (err) throw new IPCError(err.message);
        return result;
    }
    
    async setOne(accessorId:string, key:string, value:any) {
        const [err] = await electron.SetProfileData(this.#profileId, accessorId, [[key, value]]);
        if (err) throw new IPCError(err.message);
    }

    async getOne(accessorId:string, key:string) {
        const [err, result] = await electron.GetProfileData(this.#profileId, accessorId, [key]);
        if (err) throw new IPCError(err.message);
        return result[key];
    }

    /* get/set Text */
    async getAsText(accessorId:string):Promise<string> {
        const [err, contents] = await electron.GetProfileDataAsText(this.#profileId, accessorId);
        if (err) throw new IPCError(err.message);
        return contents;
    }
    async setAsText(accessorId:string, contents:string) {
        const [err] = await electron.SetProfileDataAsText(this.#profileId, accessorId, contents);
        if (err) throw new IPCError(err.message);
    }

    /* get/set Binary */
    async getAsBinary(accessorId:string):Promise<Buffer> {
        const [err, buffer] = await electron.GetProfileDataAsBinary(this.#profileId, accessorId);
        if (err) throw new IPCError(err.message);
        return buffer;
    }
    async setAsBinary(accessorId:string, buffer:Buffer) {
        const [err] = await electron.SetProfileDataAsBinary(this.#profileId, accessorId, buffer);
        if (err) throw new IPCError(err.message);
    }

    /* secret IO */
    async hasSecret(accessorId:string, keys:string[]) {
        const [err, result] = await electron.VerifyProfileDataAsSecret(this.#profileId, accessorId, keys);
        if (err) throw new IPCError(err.message);
        return result;
    }
    async setSecret(accessorId:string, data:KeyValueInput) {
        const [err] = await electron.SetProfileDataAsSecret(this.#profileId, accessorId, data);
        if (err) throw new IPCError(err.message);
    }
    async removeSecret(accessorId:string, keys:string[]) {
        const [err] = await electron.RemoveProfileDataAsSecret(this.#profileId, accessorId, keys);
        if (err) throw new IPCError(err.message);
    }
    
    /* 하위 API */
    getSessionAPI(sessionId:string):SessionAPI {
        if (!(sessionId in this.#sessionAPIs)) {
            this.#sessionAPIs[sessionId] = new SessionAPI(this.#profileId, sessionId);
        }
        return this.#sessionAPIs[sessionId] as SessionAPI;
    }
    getRTAPI(rtId:string):RTAPI {
        if (!(rtId in this.#rtAPIs)) {
            this.#rtAPIs[rtId] = new RTAPI(this.#profileId, rtId);
        }
        return this.#rtAPIs[rtId] as RTAPI;
    }

    /* 세션 */
    async getSessionIds():Promise<string[]> {
        const [err, sessionIds] = await electron.GetProfileSessionIds(this.#profileId);
        if (err) throw new IPCError(err.message);

        return sessionIds;
    }
    async createSession() {
        const [err, sid] = await electron.AddProfileSession(this.#profileId);
        if (err) throw new IPCError(err.message);
        return sid;
    }
    async removeSession(sessionId:string) {
        const [err] = await electron.RemoveProfileSession(this.#profileId, sessionId);
        if (err) throw new IPCError(err.message);

        delete this.#sessionAPIs[sessionId];
    }
    async reorderSessions(sessions:string[]):Promise<void> {
        const [err] = await electron.ReorderProfileSessions(this.#profileId, sessions);
        if (err) throw new IPCError(err.message);
    }
    async undoRemoveSession() {
        const [err, sid] = await electron.UndoRemoveProfileSession(this.#profileId);
        if (err) throw new IPCError(err.message);

        return sid;
    }

    /* RT */
    async getRTTree():Promise<RTMetadataTree> {
        const [err, tree] = await window.electron.GetProfileRTTree(this.#profileId);
        if (err) throw new IPCError(err.message);
        return tree;
    }
    async updateRTTree(tree:RTMetadataTree) {
        const [err] = await electron.UpdateProfileRTTree(this.#profileId, tree);
        if (err) throw new IPCError(err.message);
    }
    async generateRTId() {
        const [err, rtId] = await electron.GenerateProfileRTId(this.#profileId);
        if (err) throw new IPCError(err.message);
        return rtId;
    }
    async addRT(metadata:RTMetadata) {
        const [err] = await electron.AddProfileRT(this.#profileId, metadata);
        if (err) throw new IPCError(err.message);
    }
    async removeRT(rtId:string) {
        const [err] = await electron.RemoveProfileRT(this.#profileId, rtId);
        if (err) throw new IPCError(err.message);
    }
    async hasRTId(rtId:string) {
        const [err, exists] = await electron.HasProfileRTId(this.#profileId, rtId);
        if (err) throw new IPCError(err.message);
        return exists;
    }
    async changeRTId(oldId:string, newId:string) {
        const [err] = await electron.ChangeProfileRTId(this.#profileId, oldId, newId);
        if (err) throw new IPCError(err.message);
    }
}


export default ProfileAPI;
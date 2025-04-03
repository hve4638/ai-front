import * as fs from 'node:fs';
import * as path from 'node:path';
import {
    ACStorage,
    ICustomAccessor,
    MemACStorage,
    StorageAccess,
} from 'ac-storage';
import { SecretJSONAccessor, MemSecretJSONAccessor, HistoryAccessor } from '@/features/acstorage-accessor';
import { masterKeyManager } from '@/registry';
import SessionAction from './SessionAction';
import RTControl from './RTControl';
import { PROFILE_STORAGE_TREE } from './data';
import { ProfileError } from './errors';
import { v4 as uuidv4 } from 'uuid';

/**
 * 특정 Profile의 History, Store, Prompt 등을 관리
 */
class Profile {
    /** Profile 디렉토리 경로 */
    #basePath:string|null;
    #storage:ACStorage;
    #sessionControl:SessionAction;
    #rtControl:RTControl;
    #dropped:boolean = false;

    #personalKey:string;
 
    static async From(profilePath:string|null) {
        const profile = new Profile(profilePath);
        await profile.initialize();
        return profile;
    }

    private constructor(profilePath:string|null) {
        this.#basePath = profilePath;
        if (this.#basePath) {
            fs.mkdirSync(this.#basePath, {recursive: true});
            this.#storage = new ACStorage(this.#basePath);
        }
        else {
            this.#storage = new MemACStorage();
        }
        
        this.#storage.register(PROFILE_STORAGE_TREE);
        this.#storage.addAccessEvent('history', {
            async init(fullPath) {
                return new HistoryAccessor(fullPath)
            },
            async save(ac) {
                return await ac.commit();
            },
            async destroy(ac) {
                await ac.drop();
            }
        });
        this.#storage.addAccessEvent('secret-json', {
            async init(fullPath, tree) {
                if (fullPath) {
                    return new SecretJSONAccessor(fullPath, tree)
                }
                else {
                    return new MemSecretJSONAccessor(tree);
                }
            },
            async exists(ac) { return await ac.hasExistingData() },
            async load(ac) { return await ac.load() },
            async save(ac) { return await ac.save() },
            async destroy(ac) { return await ac.drop() },
        });
        
        this.#sessionControl = new SessionAction(
            this.#storage
        );
        this.#rtControl = new RTControl(
            this.#storage.subStorage('request-template')
        );
        this.#personalKey = '';
    }
    async initialize() {
        this.#personalKey = await this.#readPersonalKey();
    }

    async #readPersonalKey():Promise<string> {
        const masterKey = masterKeyManager.masterKey;
        if (!masterKey) throw new ProfileError('Master key is not initialized');

        const uniqueAC = await this.#storage.access('unique', 'secret-json') as SecretJSONAccessor;
        uniqueAC.initializeKey(masterKey);
        let key = await uniqueAC.getOne('personal-key') as string|undefined;
        if (key == undefined) {
            key = uuidv4().trim();
            uniqueAC.setOne('personal-key', key);
        }
        return key;
    }

    async commit(): Promise<void> {
        await this.#storage.commit();
    }
    drop(): void {
        if (this.#basePath) fs.rmSync(this.#basePath, {recursive: true});
    }
    get path():string {
        return this.#basePath ?? '';
    }
    
    /* 세션 */
    async createSession():Promise<string> {
        return this.#sessionControl.createSession();
    }

    async removeSession(sid:string):Promise<void> {
        await this.#sessionControl.removeSession(sid);
    }

    async undoRemoveSession():Promise<string|null> {
        return await this.#sessionControl.undoRemoveSession();
    }

    async setSelectedSession(sid:string) {
        await this.#sessionControl.setSelectedSession(sid);
    }

    async permanentRemoveSession(sid:string) {
        this.#sessionControl.permanentRemoveSession(sid);
    }

    async removeOrphanSessions() {
        if (!this.#basePath) return;
        
        const sessionPath = path.join(this.#basePath, 'session');
        
        this.#sessionControl.removeOrphanSessions(sessionPath);
    }

    async reorderSessions(newSessionIds:string[]) {
        this.#sessionControl.reorderSessions(newSessionIds);
    }

    async getSessionIds():Promise<string[]> {
        return await this.#sessionControl.getSessionIds();
    }

    /* 요청 템플릿 */
    async getRTData(rtId:string, accessId:string, keys:string[]):Promise<any> {
        return this.#rtControl.getRTData(rtId, accessId, keys);
    }
    async setRTData(rtId:string, accessId:string, data:KeyValueInput) {
        return this.#rtControl.setRTData(rtId, accessId, data);
    }
    async getRTTree() {
        return this.#rtControl.getTree();
    }
    async updateRTTree(newTree:RTMetadataTree) {
        this.#rtControl.updateTree(newTree);
    }
    async addRT(metadata:RTMetadata) {
        this.#rtControl.addRT(metadata);
    }
    async removeRT(rtId:string) {
        this.#rtControl.removeRT(rtId);
    }
    async getRTMode(rtId:string):Promise<RTMode> {
        return await this.#rtControl.getRTMode(rtId);
    }
    async setRTMode(rtId:string, mode:RTMode) {
        await this.#rtControl.setRTMode(rtId, mode);
    }
    async getRTPromptData(rtId:string, promptId:string, keys:string[]) {
        return await this.#rtControl.getRTPromptData(rtId, promptId, keys);
    }
    async setRTPromptData(rtId:string, promptId:string, data:KeyValueInput) {
        await this.#rtControl.setRTPromptData(rtId, promptId, data);
    }
    async hasRTId(rtId:string):Promise<boolean> {
        return await this.#rtControl.hasId(rtId);
    }
    async generateRTId():Promise<string> {
        return await this.#rtControl.generateId();
    }
    async changeRTId(oldRTId:string, newRTId:string) {
        return this.#rtControl.changeId(oldRTId, newRTId);
    }
    async updateRTMetadata(rtId:string) {
        return this.#rtControl.updateRTMetadata(rtId);
    }
    
    /* 직접 접근 */
    async accessAsJSON(identifier:string) {
        return await this.#storage.accessAsJSON(identifier);
    }
    async accessAsText(identifier:string) {
        return await this.#storage.accessAsText(identifier);
    }
    async accessAsBinary(identifier:string) {
        return await this.#storage.accessAsBinary(identifier);
    }
    async accessAsHistory(id:string) {
        return await this.#storage.access(`history:${id}`, 'history') as HistoryAccessor;
    }
    async accessAsSecret(identifier:string) {
        const ac = await this.#storage.access(identifier, 'secret-json') as SecretJSONAccessor;
        ac.initializeKey(this.#personalKey);
        return ac;
    }
}

export default Profile;
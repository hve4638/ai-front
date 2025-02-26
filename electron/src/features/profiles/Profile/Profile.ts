import * as fs from 'node:fs';
import * as path from 'node:path';
import {
    ACStorage,
    ICustomAccessor,
    MemACStorage,
    StorageAccess,
} from 'ac-storage';
import HistoryAccessor from '../HistoryAccessor';
import SessionControl from './SessionControl';
import RTControl from './RTControl';
import { PROFILE_STORAGE_TREE } from './data';

/**
 * 특정 Profile의 History, Store, Prompt 등을 관리
 */
class Profile {
    /** Profile 디렉토리 경로 */
    #basePath:string|null;
    #storage:ACStorage;
    #sessionControl:SessionControl;
    #rtControl:RTControl;
    #dropped:boolean = false;
 
    constructor(profilePath:string|null) {
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
            init: (fullPath) => new HistoryAccessor(fullPath),
            save: (ac) => ac.commit(),
            destroy: (ac) => ac.drop(),
        });
        
        
        this.#sessionControl = new SessionControl(
            this.#storage
        );
        this.#rtControl = new RTControl(
            this.#storage.subStorage('request-template')
        );
    }
    commit(): void {
        this.#storage.commit();
    }
    drop(): void {
        if (this.#basePath) fs.rmSync(this.#basePath, {recursive: true});
    }
    get path(): string {
        return this.#basePath ?? '';
    }
    
    /* 세션 */
    createSession():string {
        return this.#sessionControl.createSession();
    }
    
    removeSession(sid:string) {
        this.#sessionControl.removeSession(sid);
    }

    undoRemoveSession():string|null {
        return this.#sessionControl.undoRemoveSession();
    }

    permanentRemoveSession(sid:string) {
        this.#sessionControl.permanentRemoveSession(sid);
    }

    removeOrphanSessions() {
        if (!this.#basePath) return;
        
        const sessionPath = path.join(this.#basePath, 'session');
        
        this.#sessionControl.removeOrphanSessions(sessionPath);
    }

    reorderSessions(newSessionIds:string[]) {
        this.#sessionControl.reorderSessions(newSessionIds);
    }

    getSessionIds():string[] {
        return this.#sessionControl.getSessionIds();
    }

    /* 요청 템플릿 */
    getRTTree() {
        return this.#rtControl.getTree();
    }
    updateRTTree(newTree:RTMetadataTree) {
        this.#rtControl.updateTree(newTree);
    }
    addRT(metadata:RTMetadata) {
        this.#rtControl.addRT(metadata);
    }
    removeRT(rtId:string) {
        this.#rtControl.removeRT(rtId);
    }
    getRTMode(rtId:string):RTMode {
        return this.#rtControl.getRTMode(rtId);
    }
    setRTMode(rtId:string, mode:RTMode) {
        this.#rtControl.setRTMode(rtId, mode);
    }
    getRTPromptData(rtId:string, promptId:string, keys:string[]) {
        return this.#rtControl.getRTPromptData(rtId, promptId, keys);
    }
    setRTPromptData(rtId:string, promptId:string, data:KeyValueInput) {
        this.#rtControl.setRTPromptData(rtId, promptId, data);
    }
    hasRTId(rtId:string):boolean {
        return this.#rtControl.hasId(rtId);
    }
    generateRTId():string {
        return this.#rtControl.generateId();
    }
    changeRTId(oldRTId:string, newRTId:string) {
        return this.#rtControl.changeId(oldRTId, newRTId);
    }
    
    /* 직접 접근 */
    accessAsJSON(identifier:string) {
        return this.#storage.accessAsJSON(identifier);
    }
    accessAsText(identifier:string) {
        return this.#storage.accessAsText(identifier);
    }
    accessAsBinary(identifier:string) {
        return this.#storage.accessAsBinary(identifier);
    }
    accessAsHistory(id:string):HistoryAccessor {
        return this.#storage.access(`history:${id}`, 'history') as HistoryAccessor;
    }

    /** @deprecated use accessAsJSON() instead */
    getJSONAccessor(identifier:string) {
        return this.#storage.accessAsJSON(identifier);
    }

    /** @deprecated use accessAsTEXT() instead */
    getTextAccessor(identifier:string) {
        return this.#storage.accessAsText(identifier);
    }

    /** @deprecated use accessAsBinary() instead */
    getBinaryAccessor(identifier:string) {
        return this.#storage.accessAsBinary(identifier);
    }

    /** @deprecated use accessAsHistory() instead */
    getHistoryAccessor(id:string):HistoryAccessor {
        return this.#storage.access(`history:${id}`, 'history') as HistoryAccessor;
    }
}

export default Profile;
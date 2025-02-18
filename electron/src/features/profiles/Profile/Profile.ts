import * as fs from 'node:fs';
import * as path from 'node:path';
import {
    ACStorage,
    StorageAccess,
    type IAccessor
} from 'ac-storage';
import HistoryAccessor from '../HistoryAccessor';
import SessionControl from './SessionControl';
import RTControl from './RTControl';
import { PROFILE_STORAGE_TREE } from './data';

/**
 * 특정 Profile의 History, Store, Prompt 등을 관리
 */
class Profile implements IAccessor{
    /** Profile 디렉토리 경로 */
    #basePath:string;
    #storage:ACStorage;
    #sessionControl:SessionControl;
    #rtControl:RTControl;
    #dropped:boolean = false;
 
    constructor(profilePath:string) {
        this.#basePath = profilePath;
        fs.mkdirSync(this.#basePath, {recursive: true});

        this.#storage = new ACStorage(this.#basePath);
        this.#storage.addAccessEvent('history', {
            create: (fullPath:string) => new HistoryAccessor(fullPath),
        });
        
        this.#storage.register(PROFILE_STORAGE_TREE);
        this.#sessionControl = new SessionControl(this.#storage);
        this.#rtControl = new RTControl(this.#storage);
    }
    commit(): void {
        this.#storage.commit();
    }
    drop(): void {
        if (this.dropped) return;
    }
    get path(): string {
        return this.#basePath;
    }
    get dropped(): boolean {
        return this.#dropped;
        fs.rmSync(this.#basePath, {recursive: true});
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
    getRTPromptData(rtId:string, promptId:string, keys:string[]):RTPromptData {
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
    getJSONAccessor(identifier:string) {
        return this.#storage.getJSONAccessor(identifier);
    }

    getTextAccessor(identifier:string) {
        return this.#storage.getTextAccessor(identifier);
    }

    getBinaryAccessor(identifier:string) {
        return this.#storage.getBinaryAccessor(identifier);
    }

    getHistoryAccessor(id:string):HistoryAccessor {
        return this.#storage.getAccessor(`history:${id}`, 'history') as HistoryAccessor;
    }
}

export default Profile;
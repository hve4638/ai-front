import * as fs from 'node:fs';
import * as path from 'node:path';
import {
    ACStorage,
    ICustomAccessor,
    MemACStorage,
    StorageAccess,
} from 'ac-storage';
import { SecretJSONAccessor, MemSecretJSONAccessor, HistoryAccessor } from '@/features/acstorage-accessor';
import runtime from '@/runtime';
import ProfileSessions from './ProfileSessions';
import RTControl from './rt/ProfileRTs';
import { PROFILE_STORAGE_TREE } from './data';
import { ProfileError } from './errors';
import { v4 as uuidv4 } from 'uuid';
import ProfileRT from './rt/ProfileRT';
// import IRTControl from './rt/IRTControl';
import { PromptOnlyTemplateFactory } from '@/features/rt-template-factory';

/**
 * 특정 Profile의 History, Store, Prompt 등을 관리
 */
class Profile {
    /** Profile 디렉토리 경로 */
    #basePath: string | null;
    #storage: ACStorage;
    #sessionControl: ProfileSessions;
    #rtControl: RTControl;
    #dropped: boolean = false;

    #personalKey: string;

    static async From(profilePath: string | null) {
        const profile = new Profile(profilePath);
        await profile.initialize();
        return profile;
    }

    private constructor(profilePath: string | null) {
        this.#basePath = profilePath;
        if (this.#basePath) {
            fs.mkdirSync(this.#basePath, { recursive: true });
            this.#storage = new ACStorage(this.#basePath);
        }
        else {
            this.#storage = new MemACStorage();
        }

        this.#storage.register(PROFILE_STORAGE_TREE);
        this.#storage.addListener('access', (identifier) => {
            runtime.logger.trace(`Profile storage accessed: ${identifier}`);
        });
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
                const masterKey = runtime.masterKeyManager.masterKey;
                if (!masterKey) throw new ProfileError('Master key is not initialized');

                if (fullPath) {
                    const ac = new SecretJSONAccessor(fullPath, tree);
                    ac.initializeKey(masterKey);
                    return ac;
                }
                else {
                    const ac = new MemSecretJSONAccessor(tree);
                    ac.initializeKey(masterKey);
                    return ac;
                }
            },
            async create(ac) { },
            async exists(ac) { return await ac.hasExistingData() },
            async load(ac) { return await ac.load() },
            async save(ac) { return await ac.save() },
            async destroy(ac) { return await ac.drop() },
        });

        this.#sessionControl = new ProfileSessions(
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

    async #readPersonalKey(): Promise<string> {
        const masterKey = runtime.masterKeyManager.masterKey;
        if (!masterKey) throw new ProfileError('Master key is not initialized');

        const uniqueAC = await this.#storage.access('unique', 'secret-json') as SecretJSONAccessor;
        uniqueAC.initializeKey(masterKey);

        let key = await uniqueAC.getOne('personal-key') as string | undefined;
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
        if (this.#basePath) fs.rmSync(this.#basePath, { recursive: true, force: true });
    }
    get path(): string {
        return this.#basePath ?? '';
    }

    get sessions() {
        return this.#sessionControl;
    }

    session(sessionId: string) {
        return this.#sessionControl.session(sessionId);
    }
    rt(rtId: string): ProfileRT {
        return this.#rtControl.rt(rtId);
    }

    /* 요청 템플릿 */
    async getRTTree() {
        return this.#rtControl.getTree();
    }
    async updateRTTree(newTree: RTMetadataTree) {
        this.#rtControl.updateTree(newTree);
    }
    async createUsingTemplate(metadata: RTMetadata, templateId: string) {
        runtime.logger.info(`Create new RT using template: ${templateId} (${metadata.id})`);

        if (metadata.mode === 'prompt_only') {
            switch (templateId) {
                case 'normal':
                    await PromptOnlyTemplateFactory.normal(this, metadata.id, metadata.name);
                    break;
                case 'chat':
                    await PromptOnlyTemplateFactory.chat(this, metadata.id, metadata.name);
                    break;
                case 'translate':
                    await PromptOnlyTemplateFactory.translate(this, metadata.id, metadata.name);
                    break;
                case 'debug':
                    await PromptOnlyTemplateFactory.debug(this, metadata.id, metadata.name);
                    break;
                default:
                    console.warn(`Unknown templateId: ${templateId}`);
                /* through */
                case 'empty':
                    await PromptOnlyTemplateFactory.empty(this, metadata.id, metadata.name);
                    break;
            }
        }
        else {
            switch (templateId) {
                default:
                    // await PromptOnlyTemplateFactory.empty(this, metadata.id, metadata.name);
                    break;
            }
        }
    }
    async addRT(metadata: RTMetadata) {
        this.#rtControl.addRT(metadata);
    }
    async removeRT(rtId: string) {
        this.#rtControl.removeRT(rtId);
    }

    async hasRTId(rtId: string): Promise<boolean> {
        return await this.#rtControl.hasId(rtId);
    }
    async generateRTId(): Promise<string> {
        return await this.#rtControl.generateId();
    }
    async changeRTId(oldRTId: string, newRTId: string) {
        return this.#rtControl.changeId(oldRTId, newRTId);
    }
    async updateRTMetadata(rtId: string) {
        return this.#rtControl.updateRTMetadata(rtId);
    }

    async accessAsHistory(sessionId: string) {
        return await this.#storage.access(`session:${sessionId}:history`, 'history') as HistoryAccessor;
    }

    /* 직접 접근 */
    async accessAsJSON(identifier: string) {
        return await this.#storage.accessAsJSON(identifier);
    }
    async accessAsText(identifier: string) {
        return await this.#storage.accessAsText(identifier);
    }
    async accessAsBinary(identifier: string) {
        return await this.#storage.accessAsBinary(identifier);
    }
    async accessAsSecret(identifier: string) {
        const ac = await this.#storage.access(identifier, 'secret-json') as SecretJSONAccessor;
        // ac.initializeKey(this.#personalKey);
        return ac;
    }
}

export default Profile;
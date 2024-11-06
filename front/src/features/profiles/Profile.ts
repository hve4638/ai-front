import IPCAPI from 'api';
import { IPromptMetadata, PromptMetadata, PromptMetadataTree, PromptMetadataVerifier } from 'features/prompts';
import { PROMPT_METADATA_PARSE_ERRORS, PromptMetadataParseError } from 'features/prompts/errors'
import type { RawPromptMetadataElement } from 'features/prompts/types';

class Profile {
    #profileName:string;
    #rootPromptMetadata?:PromptMetadataTree;
    constructor(profileName:string) {
        this.#profileName = profileName;
    }

    get profileName() {
        return this.#profileName;
    }

    get rootPromptMetadata():PromptMetadataTree {
        if (this.#rootPromptMetadata) {
            return this.#rootPromptMetadata;
        }
        else {
            throw new Error('Root Prompt Metadata is not loaded');
        }
    }

    /** 특정 Storage에 데이터 저장 */
    getValue(storageName:string, key:string) {
        return IPCAPI.loadProfileValue(this.#profileName, storageName, key);
    }

    /** 특정 Storage에 데이터 불러오기 */
    setValue(storageName:string, key:string, value:any) {
        return IPCAPI.storeProfileValue(this.#profileName, storageName, key, value);
    }

    /** 특정 History의 데이터 불러오기 */
    getHistoryData(historyName:string, offset:number, limit:number) {
        return IPCAPI.loadProfileHistory(this.#profileName, historyName, offset, limit);
    }

    /** 특정 History에 데이터 추가 */
    addHistoryData(historyName:string, data:any) {
        return IPCAPI.storeProfileHistory(this.#profileName, historyName, data);
    }

    /** 특정 History의 데이터 삭제 */
    deleteHistoryData(historyName:string, id:number) {
        return IPCAPI.deleteProfileHistory(this.#profileName, historyName, id);
    }

    /** 특정 History 전체 삭제 */
    deleteAllHistoryData(historyName:string) {
        return IPCAPI.deleteAllProfileHistory(this.#profileName, historyName);
    }

    /** PromptMetadata 로드 */
    async loadPromptMetadata() {
        if (this.#rootPromptMetadata) return;

        let possibleLegacyFormatMetadata:string = await IPCAPI.loadRootPromptMetadata(this.#profileName);
        
        const verifier = new PromptMetadataVerifier();
        const [rawMetadata, modules] = verifier.parsePromptMetadataTree(
            possibleLegacyFormatMetadata,
            {
                name : 'root',
            }
        );
        
        const externalPromptMetadata:{
            [key:string]:RawPromptMetadataElement
        } = {};
        
        // 외부 모듈 로드
        for (const moduleName of modules) {
            if (!moduleName.match(/\w+/)) {
                throw new PromptMetadataParseError(
                    'Invalid Module Name',
                    {
                        errorType: PROMPT_METADATA_PARSE_ERRORS.INVALID_MODULE_NAME,
                        target: `module name : ${moduleName}`,
                    }
                )
            }
            
            const moduleContent = await IPCAPI.loadModulePromptMetadata(this.#profileName, moduleName);
            const metadata = verifier.parseModulePromptMetadata(
                moduleContent,
                {
                    name : moduleName,
                }
            );
            externalPromptMetadata[moduleName] = metadata;
        }
        
        // Root Prompt Metadata Tree 생성
        this.#rootPromptMetadata = new PromptMetadataTree(
            this.#profileName,
            rawMetadata,
            externalPromptMetadata
        );
    }

    async getPromptTemplate(moduleName:string, templateName:string) {
        return IPCAPI.loadPromptTemplate(this.#profileName, moduleName, templateName);
    }
}


export default Profile;
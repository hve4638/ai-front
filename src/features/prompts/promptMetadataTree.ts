import {
    IPromptMetadata,
    RawPromptMetadata,
    RawPromptMetadataElement,
    RawPromptMetadataList,
    RawPromptMetadataTree,
    Selects
} from './types'
import { PromptMetadata } from './promptMetadata';
import { PROMPT_METADATA_PARSE_ERRORS, PromptMetadataInternalError, PromptMetadataParseError, StructVerifyFailedError } from './errors';
import { PromptMetadataSublist } from './promptMetadataSublist';

export interface PromptCache {
    [key:string]:{
        data:PromptMetadata,
        index:[number, number|null]
    };
}

type ModulePromptMetadatas = {
    [key:string]:RawPromptMetadataElement
}

/**
 * @param root - RawPromptMetadataTree
 */
export class PromptMetadataTree {
    #profile:string;
    #raw:RawPromptMetadataTree;
    #selects:Selects;
    #promptTree:(PromptMetadata|PromptMetadataSublist)[];
    #promptCache:PromptCache;
    #externalMetadataElements:ModulePromptMetadatas;
    
    constructor(profile:string, root:RawPromptMetadataTree, externalMetadataElements:ModulePromptMetadatas = {}) {
        this.#verify(root);
        
        this.#profile = profile;
        this.#raw = root;
        this.#selects = root.selects;
        this.#promptCache = {};
        this.#promptTree = [];
        this.#externalMetadataElements = externalMetadataElements;
        
        for (const i in root.prompts) {
            let element = root.prompts[i];
            let basePath = '';
            try {
                // ImportPromptMetadata인 경우 외부 모듈을 가져옴
                if ("import" in element) {
                    const moduleName = element.import as string;
                    const externalElement = externalMetadataElements[moduleName];

                    if (!externalElement) {
                        throw new PromptMetadataParseError(
                            `Try to import module '${moduleName}' but not found`,
                            {
                                errorType : PROMPT_METADATA_PARSE_ERRORS.MODULE_NOT_FOUND,
                                target : element
                            }
                        );
                    }
                    element = externalElement as RawPromptMetadata|RawPromptMetadataList;
                    basePath = moduleName;
                }

                const metadataArgs = {
                    basePath,
                    selects : this.#selects
                }
                
                let metadata;
                if (metadata = this.#tryMakePromptMetadata(element, metadataArgs)) {
                    this.#promptTree.push(metadata);
                    this.#addPromptCache(metadata, [Number(i), null]);
                }
                else {
                    const sublist = new PromptMetadataSublist(
                        this.#profile,
                        element as RawPromptMetadataList,
                        metadataArgs
                    );
                    for (const j in sublist.list) {
                        const metadata = sublist.list[j];
                        this.#addPromptCache(metadata, [Number(i), Number(j)]);
                    }
                    this.#promptTree.push(sublist);
                }
            }
            catch (e) {
                if (e instanceof StructVerifyFailedError) {
                    throw new PromptMetadataParseError(
                        `Invalid format (key: '${e.rawdata.key}') - ${e.rawdata.message}`,
                        {
                            errorType : PROMPT_METADATA_PARSE_ERRORS.INVALID_FORMAT,
                            target : JSON.stringify(e.rawdata, null, 2)
                        }
                    );
                }
                else if (e instanceof PromptMetadataInternalError) {
                    throw new PromptMetadataParseError(e.message);
                }
                else {
                    throw e;
                }                
            }
        }
    }

    /**
     * RawPromptMetadataTree의 최상위 노드 유효성 검사
     */
    #verify(data:RawPromptMetadataTree) {
        if (!Array.isArray(data.prompts)) {
            throw new PromptMetadataParseError(
                "Invalid format (root) : Prompts must be an array",
                {
                    errorType : PROMPT_METADATA_PARSE_ERRORS.INVALID_FORMAT,
                    target : data
                }
            );
        }
        if (data.prompts.length === 0) {
            throw new PromptMetadataParseError(
                "Invalid format (root) : Prompts is empty",
                {
                    errorType : PROMPT_METADATA_PARSE_ERRORS.INVALID_FORMAT,
                    target : data
                }
            );
        }
    }
    
    #tryMakePromptMetadata(rawMetadata:RawPromptMetadataElement, metadataArgs:{basePath:string, selects:Selects}):PromptMetadata|null {
        try {
            return PromptMetadata.parse(
                this.#profile,
                rawMetadata as RawPromptMetadata,
                metadataArgs
            );
        }
        catch (e) {
            if (e instanceof StructVerifyFailedError) {
                return null;
            }
            else {
                throw e;
            }
        }
    }

    /**
     * PromptMetadata를 promptCache에 추가하고 PromptMetadata의 indexes를 설정
     */
    #addPromptCache(metadata:PromptMetadata, indexes:[number, number|null]) {
        if (metadata.key in this.#promptCache) {
            throw new PromptMetadataParseError(
                `Duplicate prompt key: ${metadata.key}`,
                {
                    errorType : PROMPT_METADATA_PARSE_ERRORS.INVALID_FORMAT,
                    target : JSON.stringify(metadata, null, 2)
                }
            );
        }
        else {
            metadata.setIndexes(indexes[0], indexes[1]);
            
            this.#promptCache[metadata.key] = {
                data : metadata,
                index : indexes
            };
        }
    }

    /**
     * prompt key에 해당하는 PromptMetadata를 반환, 없을 경우 null 반환
     * @param key 프롬프트 키
     */
    getPromptMetadata(key:string):IPromptMetadata|null {
        if (key in this.#promptCache) {
            return this.#promptCache[key].data;
        }
        else {
            return null;
        }
    }
    
    /**
     * @Deprecated
     */
    getPromptIndex(key:string):any {
        if (key in this.#promptCache) {
            return this.#promptCache[key].data.indexes;
        }
        else {
            return null;
        }
    }

    get list() {
        return this.#promptTree;
    }

    /**
     * @deprecated - firstPromptMetadata로 대체
     */
    firstPrompt() {
        const item = this.#promptTree[0];
        if (item instanceof PromptMetadata) {
            return item;
        }
        else {
            return item.firstPrompt();
        }
    }

    firstPromptMetadata() {
        const item = this.#promptTree[0];
        if (item instanceof PromptMetadata) {
            return item;
        }
        else {
            return item.firstPromptMetadata();
        }
    }
}
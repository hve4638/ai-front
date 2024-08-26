import {
    IPromptMetadataFormatParser,
    RawPromptMetadata,
    RootPromptMetadata,
    SelectRef
} from './types'
import { PromptMetadata } from './promptMetadata';
import { PromptMetadataError, PromptMetadataTreeError, StructVerifyFailedError } from './errors';
import { PromptMetadataSublist } from './promptMetadataSublist';

export interface PromptCache {
    [key:string]:{
        data:PromptMetadata,
        index:number[]
    };
}

/**
 * @param root - RootPromptMetadata
 * 
 */
export class PromptMetadataTree implements IPromptMetadataFormatParser {
    #raw:RootPromptMetadata;
    #selectref:SelectRef;
    #promptTree:(PromptMetadata|PromptMetadataSublist)[];
    #promptCache:PromptCache;

    constructor(root:RootPromptMetadata) {
        try {
            this.#verify(root);
        }
        catch(e) {
            if (e instanceof StructVerifyFailedError) {
                throw new PromptMetadataTreeError(`Invalid format (root) : ${e.message}`);
            }
            else {
                throw e;
            }
        }
        
        this.#raw = root;
        this.#selectref = root.selectref ?? root.vars ?? {};
        this.#promptCache = {};
        this.#promptTree = [];
        
        for (const i in root.prompts) {
            const item = root.prompts[i];
            try {
                let metadata;
                if (metadata = this.#tryMakePromptMetadata(item)) {
                    this.#promptTree.push(metadata);
                    this.#addPromptCache(metadata, [Number(i)]);
                }
                else {
                    const sublist = new PromptMetadataSublist(
                        item as any,
                        {
                            selectRef : this.#selectref,
                            basePath : '',
                        }
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
                    throw new PromptMetadataTreeError(`Invalid format (key: '${e.rawdata.key}') - ${e.rawdata.message}`);
                }
                else if (e instanceof PromptMetadataError) {
                    throw new PromptMetadataTreeError(e.message);
                }
                else {
                    throw e;
                }                
            }
        }
    }

    #verify(data:RootPromptMetadata) {
        if (!('prompts' in data)) {
            throw new StructVerifyFailedError('missing field : prompts', data);
        }
        if (!(typeof data.prompts === 'object' && Array.isArray(data.prompts))) {
            throw new StructVerifyFailedError('invalid field : prompts', data);
        }
        if (data.prompts.length === 0) {
            throw new StructVerifyFailedError('empty field : prompts', data);
        }
    }
    
    #tryMakePromptMetadata(rawMetadata:RawPromptMetadata) {
        try {
            return new PromptMetadata(
                rawMetadata,
                {
                    selectRef : this.#selectref,
                    basePath : '',
                }
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

    #addPromptCache(metadata:PromptMetadata, indexes:number[]) {
        if (metadata.key in this.#promptCache) {
            throw new PromptMetadataTreeError(`Duplicate prompt key: ${metadata.key}`);
        }
        else {
            metadata.setIndexes(indexes[0], indexes[1])
            this.#promptCache[metadata.key] = {
                data : metadata,
                index : indexes
            };
        }
    }

    getPrompt(key:string):PromptMetadata|null {
        if (key in this.#promptCache) {
            return this.#promptCache[key].data;
        }
        else {
            return null;
        }
    }
    
    getPromptIndex(key:string):number[]|null {
        if (key in this.#promptCache) {
            return this.#promptCache[key].index;
        }
        else {
            return null;
        }
    }

    get list() {
        return this.#promptTree;
    }

    firstPrompt() {
        const item = this.#promptTree[0];
        if (item instanceof PromptMetadata) {
            return item;
        }
        else {
            return item.firstPrompt();
        }
    }
}
import type {
    Selects,
    RawPromptMetadataList
} from './types';
import { PromptMetadataInternalError, StructVerifyFailedError } from './errors.ts';
import { PromptMetadata } from './promptMetadata';

type PromptMetadataSublistArgs = {
    selects:Selects;
    basePath:string;
}

export class PromptMetadataSublist {
    #profile:string;
    #raw:RawPromptMetadataList;
    #list:PromptMetadata[];

    constructor(profile:string, data:RawPromptMetadataList, { selects, basePath }:PromptMetadataSublistArgs) {
        this.#verify(data);

        this.#profile = profile;
        this.#raw = data;
        this.#list = [];
        for (const item of this.#raw.list) {
            const metadata = PromptMetadata.parse(this.#profile, item as any, { selects, basePath });

            this.#list.push(metadata);
        }

        if (this.#list.length == 0) {
            throw new PromptMetadataInternalError('Empty PromptMetadataSublist is not permitted', data);
        }
    }

    #verify(data:RawPromptMetadataList) {
        if (!('key' in data)) throw new StructVerifyFailedError('missing field : key', data);
        if (!('name' in data)) throw new StructVerifyFailedError('missing field : name', data);
        if (!('list' in data)) throw new StructVerifyFailedError('missing field : list', data);
    }

    get name() {
        return this.#raw.name;
    }
    get key() {
        return this.#raw.key;
    }
    get list() {
        return this.#list;
    }
    get raw() {
        return this.#raw;
    }
    /**
     * @deprecated - use `firstPromptMetadata`
     */
    firstPrompt() {
        return this.#list[0];
    }
    firstPromptMetadata() {
        return this.#list[0];
    }
}
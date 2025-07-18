import type {
    Selects,
    RawPromptMetadataList
} from './types';
import { PromptMetadataInternalError, StructVerifyFailedError } from './errors';
import { PromptMetadata } from './promptMetadata';

type PromptMetadataSublistArgs = {
    selects:Selects;
    basePath:string;
}

export class PromptMetadataSublist {
    #raw:RawPromptMetadataList;
    #list:PromptMetadata[];

    constructor(data:RawPromptMetadataList, { selects, basePath }:PromptMetadataSublistArgs) {
        this.#verify(data);

        this.#raw = data;
        this.#list = [];
        for (const item of this.#raw.list) {
            //@ts-ignore
            const metadata = PromptMetadata.parse(item, { selects, basePath });

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
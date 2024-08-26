import type {
    SelectRef,
    RawPromptMetadataSublist
} from './types';
import { PromptMetadataError, StructVerifyFailedError } from './errors.ts';
import { PromptMetadata } from './promptMetadata';

type PromptMetadataSublistArgs = {
    selectRef:SelectRef;
    basePath:string;
}

export class PromptMetadataSublist {
    #raw:RawPromptMetadataSublist;
    #list:PromptMetadata[];

    constructor(data:RawPromptMetadataSublist, { selectRef, basePath }:PromptMetadataSublistArgs) {
        this.#verify(data);

        this.#raw = data;
        this.#list = [];
        for (const item of this.#raw.list) {
            const metadata = new PromptMetadata(item, {selectRef, basePath});

            this.#list.push(metadata);
        }

        if (this.#list.length == 0) {
            throw new PromptMetadataError('Empty PromptMetadataSublist is not permitted', data);
        }
    }

    #verify(data:RawPromptMetadataSublist) {
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
    firstPrompt() {
        return this.#list[0];
    }
}
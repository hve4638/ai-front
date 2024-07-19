import { RawPromptSublist } from 'data/interface';
import { IPromptSubList } from "./interface.ts";
import { PromptInfomation } from './promptInfomation.ts';

export class PromptSublist implements IPromptSubList {
    #raw:RawPromptSublist;
    #list:PromptInfomation[];

    constructor(data:RawPromptSublist, { selects }) {
        this.#raw = data;
        this.#list = [];

        this.#validate(this.#raw);
        this.#parseList(this.#raw, { selects })
    }

    #validate(data:RawPromptSublist) {
        if (!('name' in data)) throw this.#errorMissingField('name');
        if (!('list' in data)) throw this.#errorMissingField('list');
        if (!('key' in data)) throw this.#errorMissingField('key');
    }

    #error(message:string) {
        return new Error(`Invalid PromptInfomation (key=${this.#raw?.key}) : ${message}`);
    }

    #errorMissingField(keyword:string) {
        return this.#error(`Missing field '${keyword}'`)
    }

    #parseList(data:RawPromptSublist, {selects}) {
        this.#list = [];
        
        for (const item of data.list) {
            this.#list.push(new PromptInfomation(item, {selects}));
        }
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
    firstPrompt() {
        return this.#list[0];
    }
}
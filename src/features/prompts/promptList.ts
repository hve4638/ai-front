import { IPromptInfomation, IPromptList } from './interface'
import { MainPrompt, SubPrompt, Vars } from '../../data/interface'
import { PromptInfomation } from './promptInfomation.ts';

export interface MainPromptCache {
    [key:string]:PromptInfomation;
}
export interface SubPromptCache {
    [key:string]:{
        [key:string]:PromptInfomation
    };
}

export class PromptList implements IPromptList {
    #raw:MainPrompt[];
    #selectref:Vars;
    #prompts:PromptInfomation[];
    #prompt1Cache:MainPromptCache;
    #prompt2Cache:SubPromptCache;

    constructor(promptlist) {
        const prompts = promptlist.prompts;
        if (prompts == null) {
            throw new Error('Invalid promptlist');
        }
        else if (prompts.length == 0) {
            throw new Error('Empty promptlist');
        }
        this.#raw = prompts;
        this.#selectref = promptlist.selectref ?? promptlist.vars ?? {};
        this.#prompt1Cache = {};
        this.#prompt2Cache = {};
        this.#prompts = [];
        
        for (const item of prompts) {
            if (item.key === '') {
                throw new Error(`Invalid prompt : Prompt key can't be an empty string.`);
            }
            else if (item.key in this.#prompt1Cache) {
                throw new Error(`Duplicate prompt key: ${item.key}`);
            }
            const pl = new PromptInfomation(item, {selects : this.#selectref});
            this.#prompts.push(pl);

            this.#prompt1Cache[item.key] = pl;
            
            if (item.value && item.list) {
                throw new Error(`Invalid prompt (key: ${item.key}) : Prompt must contain either 'list' or 'value', not both.`);
            }
            else if (pl.list) {
                const cache = {};
                this.#prompt2Cache[pl.key] = cache;

                for (const subpl of pl.list) {
                    cache[subpl.key] = subpl;
                }
            }
        }
    }

    findValidPromptKey(expectedKey1, expectedKey2) {
        let prompt1Key = expectedKey1;
        let prompt2Key = expectedKey2;
        if (!(prompt1Key in this.#prompt1Cache)) {
            prompt1Key = this.#prompts[0].key;
        }
        const prompt1 = this.#prompt1Cache[prompt1Key];

        if (!prompt1.list) {
            prompt2Key = null;
        }
        else if (!(prompt2Key ?? '' in this.#prompt2Cache[prompt1Key])) {
            prompt2Key = prompt1.list[0].key;
        }

        return [ prompt1Key, prompt2Key ]
    }

    getPrompt(key1:string, key2?:string):IPromptInfomation|null {
        if (!(key1 in this.#prompt1Cache)) {
            return null;
        }
        else {
            const prompt1 = this.#prompt1Cache[key1];
            if (!prompt1.list || key2 == null) {
                return prompt1;
            }
            else if (key2 in this.#prompt2Cache[key1]) {
                const prompt2 = this.#prompt2Cache[key1][key2]
                return prompt2;
            }
            else {
                return null;
            }
        }
    }

    get list() {
        return this.#prompts;
    }
}
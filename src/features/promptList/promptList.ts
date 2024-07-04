import { IPromptList, MainPromptCache, SubPromptCache } from './interface'
import { MainPrompt, SubPrompt, Vars } from '../../data/interface'

export class PromptList implements IPromptList {
    #prompts:MainPrompt[];
    #vars:Vars;
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
        this.#prompts = prompts;
        this.#vars = promptlist.vars ?? {};
        this.#prompt1Cache = {};
        this.#prompt2Cache = {};
        
        for (const item of prompts) {
            if (item.key === '') {
                throw new Error(`Invalid prompt : Prompt key can't be an empty string.`);
            }
            else if (item.key in this.#prompt1Cache) {
                throw new Error(`Duplicate prompt key: ${item.key}`);
            }
            this.#prompt1Cache[item.key] = item;
            
            if (item.value && item.list) {
                throw new Error(`Invalid prompt (key: ${item.key}) : The prompt must contain either 'list' or 'value', not both.`);
            }
            else if (item.list) {
                const cache = {};
                this.#prompt2Cache[item.key] = cache;

                for (const subitem of item.list) {
                    if (subitem.key in cache) {
                        throw new Error(`Duplicate prompt2 key: ${item.key}`)
                    }
                    cache[subitem.key] = subitem;
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

    getPrompt(key1:string):MainPrompt|null;
    getPrompt(key1:string, key2:string):SubPrompt|null;
    getPrompt(key1:string, key2?:string):MainPrompt|SubPrompt|null {
        if (key1 in this.#prompt1Cache) {
            const prompt1 = this.#prompt1Cache[key1];

            if (!prompt1.list) {
                return prompt1;
            }
            else if (key2 == null) {
                return null;
            }
            else if (key2 in this.#prompt2Cache[key1]) {
                const prompt2 = this.#prompt2Cache[key1][key2]
                return prompt2;
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
    }
}
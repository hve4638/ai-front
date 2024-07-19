import { MainPrompt, RawPrompt, RawPromptSublist, Vars } from 'data/interface'
import { IPromptInfomation, IPromptList, IPromptSubList } from './interface'
import { PromptInfomation } from './promptInfomation.ts';
import { PromptSublist } from './promptSublist.ts';

export interface PromptCache {
    [key:string]:{
        data:IPromptInfomation,
        index:number[]
    };
}

export class PromptList implements IPromptList {
    #raw:MainPrompt[];
    #selectref:Vars;
    #prompts:(PromptInfomation|PromptSublist)[];
    #promptCache:PromptCache;

    constructor(promptlist) {
        const prompts:(RawPrompt|RawPromptSublist)[] = promptlist.prompts;
        if (prompts == null) {
            throw new Error('Invalid promptlist');
        }
        else if (prompts.length == 0) {
            throw new Error('Empty promptlist');
        }
        this.#raw = prompts;
        this.#selectref = promptlist.selectref ?? promptlist.vars ?? {};
        this.#promptCache = {};
        //this.#promptSublistCache = {};
        this.#prompts = [];
        
        for (const index in prompts) {
            const item = prompts[index];
            if (item.key === '') {
                throw new Error(`Invalid prompt : key can't be an empty string.`);
            }
            else if (this.#isPrompt(item)) {
                const pi = new PromptInfomation(item, {selects : this.#selectref});
                this.#prompts.push(pi);
                this.#addPromptCache(pi, [Number(index)]);
            }
            else if (this.#isPromptSublist(item)) {
                const sublist = new PromptSublist(item, {selects : this.#selectref});
                for (const subindex in sublist.list) {
                    const pi = sublist.list[subindex];
                    this.#addPromptCache(pi, [Number(index), Number(subindex)]);
                }
                this.#prompts.push(sublist);
            }
            else {
                throw new Error(`Invalid prompt : invalid format`);
            }
        }

        if (this.#prompts.length == 0) {
            throw new Error("Empty Promptlist is not permitted")
        }
    }

    #addPromptCache(pi:PromptInfomation, index:number[]) {
        if (pi.key in this.#promptCache) {
            throw new Error(`Duplicate prompt key: ${pi.key}`);
        }
        else {
            this.#promptCache[pi.key] = {
                data : pi,
                index : index
            };
        }
    }

    #isPrompt(item:RawPrompt|RawPromptSublist) {
        return ('value' in item && 'key' in item);
    }

    #isPromptSublist(item:RawPrompt|RawPromptSublist) {
        return ('list' in item);
    }

    getPrompt(key:string):IPromptInfomation|null {
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
        return this.#prompts;
    }

    firstPrompt() {
        const item = this.#prompts[0];
        if (item instanceof PromptInfomation) {
            return item;
        }
        else {
            return item.firstPrompt();
        }
    }
}
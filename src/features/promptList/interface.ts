import {MainPrompt, SubPrompt, Vars} from '../../data/interface'

export interface IPromptList {
    findValidPromptKey(key1:string, key2:string|null):null[];
    getPrompt(prompt1Key:string):MainPrompt|null;
    getPrompt(prompt1Key:string, prompt2Key:string):SubPrompt|null;
}

export interface MainPromptCache {
    [key:string]:MainPrompt;
}
export interface SubPromptCache {
    [key:string]:{
        [key:string]:SubPrompt
    };
}

import {MainPrompt, SubPrompt, Vars} from '../../data/interface'

export interface IPromptInfomation {
    get name():string;
    get value():string;
    get key():string;
    get list():IPromptInfomation[]|null;
    get allVars();
    get headerExposuredVars();
}

export interface IPromptList {
    findValidPromptKey(key1:string, key2:string|null):null[];
    getPrompt(prompt1Key:string, prompt2Key?:string):IPromptInfomation|null;
    get list():IPromptInfomation[];
}

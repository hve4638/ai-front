import { PROMPT_VAR_TYPE } from '../data'
/*
interface IPromptList {
    getPromptMetadata(prompt1Key:string, prompt2Key?:string):IPromptInfomation|null;
    getPromptIndex(prompt1Key:string, prompt2Key?:string):number[]|null;
    get list():(IPromptInfomation|IPromptSubList)[];
    firstPrompt():IPromptInfomation;
}

interface IPromptSubList {
    get name():string;
    get list():IPromptInfomation[];
    get key():string;
    firstPrompt():IPromptInfomation;
}

interface IPromptInfomation {
    get name():string;
    get value():string;
    get key():string;
    get allVars();
    get headerExposuredVars();
}

export type RawPromptMetadata = {
    key:string;
    name:string;
    display_name?:string;
    value?:string;
    path?:string;
    vars?:(RawVarMetadata|string)[];
    selectref?:ISelectRef;
}

export type RawPromptMetadataList = {
    name:string;
    key:string;
    list:RawPromptMetadata[];
}

export interface ISelectRef {
    [refname:string]: ISelectItem[];
}
*/
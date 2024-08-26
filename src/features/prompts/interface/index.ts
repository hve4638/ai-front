import { PROMPT_VAR_TYPE } from '../data'

export interface IPromptList {
    getPrompt(prompt1Key:string, prompt2Key?:string):IPromptInfomation|null;
    getPromptIndex(prompt1Key:string, prompt2Key?:string):number[]|null;
    get list():(IPromptInfomation|IPromptSubList)[];
    firstPrompt():IPromptInfomation;
}

export interface IPromptSubList {
    get name():string;
    get list():IPromptInfomation[];
    get key():string;
    firstPrompt():IPromptInfomation;
}

export interface IPromptInfomation {
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

export type RawPromptMetadataSublist = {
    name:string;
    key:string;
    list:RawPromptMetadata[];
}

export interface ISelectRef {
    [refname:string]: ISelectItem[];
}

export interface ISelectItem {
    name:string;
    value:string;
}


export type RawVarMetadata = {
    name:string;
    display_name:string;
    type:typeof PROMPT_VAR_TYPE[keyof typeof PROMPT_VAR_TYPE];
    array_type?:RawVarMetadata[];
    tuple_types?:RawVarMetadata[];

    default_value?:any;
    selectref?:string;
    options?:ISelectItem[];
}
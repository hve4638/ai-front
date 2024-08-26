export type {
    RootPromptMetadata,
    RawPromptMetadata,
    RawPromptMetadataSublist,
} from './promptFormat';

export type {
    VarMetadata,
    SelectRef,
    SelectItem,
} from './promptMetadataElements';

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

export type {
    IPromptMetadataFormatParser
} from './interfaces'
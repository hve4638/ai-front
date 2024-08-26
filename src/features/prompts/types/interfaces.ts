interface IPromptMetadata {
    get name():string;
    get display_name():string;
    get key():string;
    get vars():{[key:string]:any}[];
    setVar(varname:string, value:any):void;
    getVar(varname:string):any;
}

interface IPromptMetadataSubList {
    get name():string;
    get list():IPromptMetadata[];
    get key():string;
    firstPrompt():IPromptMetadata;
}

export interface IPromptMetadataFormatParser {
    getPrompt(prompt1Key:string, prompt2Key?:string):IPromptMetadata|null;
    getPromptIndex(prompt1Key:string, prompt2Key?:string):number[]|null;
    get list():(IPromptMetadata|IPromptMetadataSubList)[];
    firstPrompt():IPromptMetadata;
}
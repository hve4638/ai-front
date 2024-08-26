import type {
    VarMetadata,
    SelectRef,
    SelectItem,
} from './promptMetadataElements.ts';

export type RootPromptMetadata = {
    prompts : (RawPromptMetadata|RawPromptMetadataSublist)[];
    selectref? : SelectRef;
    vars? : SelectRef; // 이전 버전 호환성
}

export type RawPromptMetadata = {
    key:string;
    name:string;
    display_name?:string;
    value?:string;
    path?:string;
    vars?:(VarMetadata|string)[];
    selectref?:SelectRef;
}

export type RawPromptMetadataSublist = {
    name:string;
    key:string;
    list:RawPromptMetadata[];
}
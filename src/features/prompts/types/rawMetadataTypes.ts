import { PROMPT_VAR_TYPE } from '../data.ts';
import type {
    VarMetadata,
    Selects,
    SelectItem,
} from './varMetadataType.ts';

export type RawPromptMetadataTree = {
    prompts : RawPromptMetadataElement[];
    selects : Selects;
}

export type RawPromptMetadataElement = RawPromptMetadata|RawPromptMetadataList|RawImportPromptMetadata;

export type RawPromptMetadata = {
    key:string;
    name:string;
    path:string;

    vars?:RawVarMetadata[];

    selects?:Selects;
}

export type RawPromptMetadataList = {
    key:string;
    name:string;
    display_name?:string;
    
    list:RawPromptMetadataElement[];
}

export type RawImportPromptMetadata = {
    import : string;
}

export type RawVarMetadata = {
    type: typeof PROMPT_VAR_TYPE[keyof typeof PROMPT_VAR_TYPE];
    name: string;
    display_name?: string;
    default_value?: any;
    show_in_header?: boolean;

    select_ref?: string;
    options?: SelectItem[];
    element?: RawArrayElementMetadata;
    fields?: RawVarMetadata[];
}

export type RawArrayElementMetadata = {
    type : typeof PROMPT_VAR_TYPE[keyof typeof PROMPT_VAR_TYPE];
    default_value?: any;
    
    select_ref?: string;
    options?: SelectItem[];
    
    element?: RawVarMetadata;
    fields?: RawVarMetadata[];
}
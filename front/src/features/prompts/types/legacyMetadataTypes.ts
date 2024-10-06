import { PROMPT_VAR_TYPE } from "../data.ts";
import type {
    Selects,
    SelectItem,
} from "./varMetadataType.ts";

export type LegacyPromptMetadataTree = {
    prompts : LegacyPromptMetadataElement[];
    selects? : Selects;
    selectref? : Selects; // @Legacy : selects 로 대체됨
    vars? : Selects; // @Legacy : selects 로 대체됨
}

export type LegacyPromptMetadataElement = LegacyPromptMetadata|LegacyPromptMetadataList|LegacyImportPromptMetadata;

export type LegacyPromptMetadata = {
    key:string;
    name:string;
    display_name?:string;
    path?:string;
    value?:string; // @Legacy : path 로 대체됨
    vars?:(LegacyVarMetadata|string)[];

    selects?:Selects;
    selectref?:Selects; // @Legacy : selects 로 대체됨
}
export type LegacyPromptMetadataList = {
    name:string;
    display_name?:string;
    key:string;
    list:LegacyPromptMetadataElement[];
}
export type LegacyImportPromptMetadata = {
    import : string;
}

export type LegacyVarMetadata = {
    type: typeof PROMPT_VAR_TYPE[keyof typeof PROMPT_VAR_TYPE];
    name: string;
    display_name?: string;
    default_value?: any;
    show_in_header?: boolean;

    select_ref?: string;
    selectref?: string; // @Legacy : select_ref 로 대체됨
    options?: SelectItem[];
    element?: LegacyArrayElementMetadata;
    fields?: LegacyVarMetadata[];
}

export type LegacyArrayElementMetadata = {
    type : typeof PROMPT_VAR_TYPE[keyof typeof PROMPT_VAR_TYPE];
    default_value?: any;
    
    select_ref?: string;
    options?: SelectItem[];
    
    element?: LegacyVarMetadata;
    fields?: LegacyVarMetadata[];
}

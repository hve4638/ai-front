import { PROMPT_VAR_TYPE } from '../data';

export type BaseVarMetadata = {
    type: string;
    name: string;
    display_name: string;
    default_value: any;
    show_in_header: boolean;
}

export type SelectVarMetadata = BaseVarMetadata & {
    type: typeof PROMPT_VAR_TYPE.SELECT;
    select_ref?: string;
    // 이전 포맷과 호환성을 위해 존재
    selectref?: string;
    options?: SelectItem[];
}

export type LiteralVarMetadata = BaseVarMetadata & {
    type: typeof PROMPT_VAR_TYPE.TEXT | typeof PROMPT_VAR_TYPE.TEXT_MULTILINE | typeof PROMPT_VAR_TYPE.NUMBER | typeof PROMPT_VAR_TYPE.BOOLEAN;
}

export type ArrayVarMetadata = BaseVarMetadata & {
    type: typeof PROMPT_VAR_TYPE.ARRAY;
    element: VarMetadata;
}

export type StructVarMetadata = BaseVarMetadata & {
    type: typeof PROMPT_VAR_TYPE.STRUCT;
    fields: NestableVarMetadata[];
}

export type ImageVarMetadata = BaseVarMetadata & {
    type: typeof PROMPT_VAR_TYPE.IMAGE;
}

export type VarMetadata = SelectVarMetadata | LiteralVarMetadata | ArrayVarMetadata | StructVarMetadata;

export type NestableVarMetadata = SelectVarMetadata | LiteralVarMetadata;

export type Selects = {
    [refname:string]: SelectItem[];
}

export type SelectItem = {
    name:string;
    value:string;
}

export type ArrayElementMetadata = Omit<VarMetadata, 'name'|'display_name'|'type'>;
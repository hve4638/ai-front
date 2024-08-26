import { PROMPT_VAR_TYPE } from '../data';

type BaseVarMetadata = {
    name: string;
    display_name?: string;
    default_value?:any;
    show_in_header?:boolean;
}

type SelectVarMetadata = BaseVarMetadata & {
    type: typeof PROMPT_VAR_TYPE.SELECT;
    selectref?: string;
    options?: SelectItem[];
}

type LiteralVarMetadata = BaseVarMetadata & {
    type: typeof PROMPT_VAR_TYPE.TEXT | typeof PROMPT_VAR_TYPE.TEXT_MULTILINE | typeof PROMPT_VAR_TYPE.NUMBER | typeof PROMPT_VAR_TYPE.BOOLEAN;
}

type ArrayVarMetadata = BaseVarMetadata & {
    type: typeof PROMPT_VAR_TYPE.ARRAY;
    array_type: VarMetadata[];
}

type TupleVarMetadata = BaseVarMetadata & {
    type: typeof PROMPT_VAR_TYPE.TUPLE;
    tuple_type: VarMetadata[];
}

// @TODO : 사용되지 않음
type ImageVarMetadata = BaseVarMetadata & {
    type: typeof PROMPT_VAR_TYPE.IMAGE;
}

export type VarMetadata = SelectVarMetadata | LiteralVarMetadata | ArrayVarMetadata | TupleVarMetadata | ImageVarMetadata;

export type SelectRef = {
    [refname:string]: SelectItem[];
}

export type SelectItem = {
    name:string;
    value:string;
}
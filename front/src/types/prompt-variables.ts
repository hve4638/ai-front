export type PromptVar = PromptVarText | PromptVarNumber | PromptVarCheckbox | PromptVarSelect | PromptVarStruct | PromptVarArray;

export const PromptVarType = {
    Text: 'text',
    Number: 'number',
    Checkbox: 'checkbox',
    Select: 'select',
    Struct: 'struct',
    Array: 'array',
} as const;
export type PromptVarType = typeof PromptVarType[keyof typeof PromptVarType];

export type PromptVarText = {
    type : 'text';
    name : string;
    display_name : string;
    default_value : string;
    placeholder : string;
    allow_multiline : boolean;
}
export type PromptVarNumber = {
    type : 'number';
    name : string;
    allow_decimal : boolean;
    display_name : string;
    default_value : number;
    maximum_value : number|null;
    minimum_value : number|null;
}
export type PromptVarCheckbox = {
    type : 'checkbox';
    name : string;
    display_name : string;
    default_value : boolean;
}
export type PromptVarSelect = {
    type : 'select';
    name : string;
    display_name : string;
    default_value : string;
    options : PromptVarSelectOption[];
}
export type PromptVarSelectOption = {
    name : string;
    value : string;
}
export type PromptVarStruct = {
    type : 'struct';
    name : string;
    display_name : string;
    fields : PromptVar[];
}
export type PromptVarArray = {
    type : 'array';
    name : string;
    display_name : string;
    minimum_length : number|null;
    maximum_length : number|null;
    element : PromptVar;
}
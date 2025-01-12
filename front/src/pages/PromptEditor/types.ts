export type PromptVar = PromptVarText | PromptVarNumber | PromptVarCheckbox | PromptVarSelect | PromptVarStruct | PromptVarArray;

export type PromptVarText = {
    type : 'text';
    name : string;
    display_name : string;
    default_value : string;
    placeholder : string;
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
    vars : PromptVar[];
}
export type PromptVarArray = {
    type : 'array';
    name : string;
    display_name : string;
    var : PromptVar;
}
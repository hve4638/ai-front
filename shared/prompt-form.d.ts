declare global {
    type PromptVarType = 'text'|'number'|'checkbox'|'select'|'struct'|'array';

    type PromptVar = PromptVarText | PromptVarNumber | PromptVarCheckbox | PromptVarSelect | PromptVarStruct | PromptVarArray;

    type PromptVarText = {
        type : 'text';
        name : string;
        display_name : string;
        default_value : string;
        placeholder : string;
        allow_multiline : boolean;
    }
    type PromptVarNumber = {
        type : 'number';
        name : string;
        allow_decimal : boolean;
        display_name : string;
        default_value : number;
        maximum_value : number|null;
        minimum_value : number|null;
    }
    type PromptVarCheckbox = {
        type : 'checkbox';
        name : string;
        display_name : string;
        default_value : boolean;
    }
    type PromptVarSelect = {
        type : 'select';
        name : string;
        display_name : string;
        default_value : string;
        options : PromptVarSelectOption[];
    }
    type PromptVarSelectOption = {
        name : string;
        value : string;
    }
    type PromptVarStruct = {
        type : 'struct';
        name : string;
        display_name : string;
        fields : PromptVar[];
    }
    type PromptVarArray = {
        type : 'array';
        name : string;
        display_name : string;
        minimum_length : number|null;
        maximum_length : number|null;
        element : PromptVar;
    }
}

export {};
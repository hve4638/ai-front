declare global {
    type RTIndex = {
        version : number;
        id : string;
        name : string;
        uuid : string;
        mode : 'flow' | 'prompt_only';
        input_type : 'normal' | 'chat';
        form_order : string[];
        entrypoint_node : number;
    }

    type RTPromptData = {
        id : string;
        name : string;
        variables : string[];
        contents : string;
    }

    type RTForm = {
        type : 'text' | 'number' | 'checkbox' | 'select' | 'array' | 'struct' ;
        id : string;
        name : string;
        display_name : string;
        display_on_header : boolean;
    
        derived_from : number[];
    
        config : {
            text? : RTFormText;
            number? : RTFormNumber;
            checkbox? : RTFormCheckbox;
            select? : RTFormSelect;
            array? : RTFormArray;
            struct? : RTFormStruct;
        }
    }
    
    type RTFormText = { 
        default_value : string;
        placeholder : string;
        allow_multiline : boolean;
    }
    type RTFormNumber = {
        default_value : number;
        minimum_value? : number;
        maximum_value? : number;
        allow_decimal : boolean;
    }
    type RTFormCheckbox = {
        default_value : boolean;
    }
    type RTFormSelect = {
        default_value : string;
        options : {
            name : string;
            value : string;
        }[];
    }
    type RTFormStruct = {
        fields : {
            type : 'text' | 'number' | 'checkbox' | 'select';
            name : string;
            display_name : string;
    
            config : {
                text? : RTFormText;
                number? : RTFormNumber;
                checkbox? : RTFormCheckbox;
                select? : RTFormSelect;
            }
        }[];
    }
    type RTFormArray = {
        minimum_length? : number;
        maximum_length? : number;
        element_type : 'text' | 'number' | 'checkbox' | 'select' | 'struct';
        config : {
            text? : RTFormText;
            number? : RTFormNumber;
            checkbox? : RTFormCheckbox;
            select? : RTFormSelect;
            struct? : RTFormStruct;
        }
    }
}

export {}
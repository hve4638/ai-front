declare global {
    type PromptVarType = 'text'|'number'|'checkbox'|'select'|'struct'|'array';

    type PromptVar = (
        PromptVarText | PromptVarNumber | PromptVarCheckbox | PromptVarSelect | PromptVarStruct | PromptVarArray
    );

    interface BasePromptVar {
        /**
         * setter 작업시 id가 없다면 생성, 있다면 갱신 작업을 수행
         * 
         * uuid 형식 권장
        */
        id? : string;
        name : string;
        display_name : string;
    }
    interface PromptVarText extends BasePromptVar {
        type : 'text';
        default_value? : string;
        placeholder : string;
        allow_multiline : boolean;
    }
    interface PromptVarNumber extends BasePromptVar {
        type : 'number';
        allow_decimal : boolean;
        default_value? : number;
        maximum_value? : number;
        minimum_value? : number;
    }
    interface PromptVarCheckbox extends BasePromptVar {
        type : 'checkbox';
        default_value? : boolean;
    }
    interface PromptVarSelect extends BasePromptVar {
        type : 'select';
        default_value? : string;
        options : {
            name : string;
            value : string;
        }[];
    }
    interface PromptVarStruct extends BasePromptVar {
        type : 'struct';
        fields : Exclude<PromptVar, PromptVarStruct|PromptVarArray>[];
    }
    interface PromptVarArray extends BasePromptVar {
        type : 'array';
        minimum_length? : number;
        maximum_length? : number;
        element : Exclude<PromptVar, PromptVarArray>;
    }
}

export {};
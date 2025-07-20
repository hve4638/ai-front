import { JSONType } from "ac-storage";

const TEXT_CONFIG = {
    'default_value' : JSONType.String().nullable().default_value(''),
    'placeholder' : JSONType.String(),
    'allow_multiline' : JSONType.Bool().default_value(false),
} as const;
const NUMBER_CONFIG = {
    'default_value' : JSONType.Number().nullable().default_value(0),
    'minimum_value' : JSONType.Number().nullable(),
    'maximum_value' : JSONType.Number().nullable(),
    'allow_decimal' : JSONType.Bool().default_value(false),
}
const CHECKBOX_CONFIG = {
    'default_value' : JSONType.Bool().default_value(false),
}
const SELECT_CONFIG = {
    'default_value' : JSONType.String().nullable(),
    'options' : JSONType.Array({
        'name' : JSONType.String(),
        'value' : JSONType.String(),
    }),
}
const STRUCT_CONFIG = {
    fields : JSONType.Array({
        'type' : JSONType.Union('text', 'number', 'checkbox', 'select'),
        'name' : JSONType.String(),
        'display_name' : JSONType.String(),
        
        'config' : {
            'text' : TEXT_CONFIG,
            'number' : NUMBER_CONFIG,
            'checkbox' : CHECKBOX_CONFIG,
            'select' : SELECT_CONFIG,
        },
    }),
}
const ARRAY_CONFIG = {
    'minimum_length' : JSONType.Number().nullable(),
    'maximum_length' : JSONType.Number().nullable(),
    'element_type' : JSONType.Union('text', 'number', 'checkbox', 'select', 'struct'),
    'config' : {
        'text' : TEXT_CONFIG,
        'number' : NUMBER_CONFIG,
        'checkbox' : CHECKBOX_CONFIG,
        'select' : SELECT_CONFIG,
        'struct' : STRUCT_CONFIG,
    },
}

const FORM_JSON_TREE = {
    'type' : JSONType.Union('text', 'number', 'checkbox', 'select', 'array', 'struct'),
    'id' : JSONType.String(),
    'display_name' : JSONType.String(),
    'display_on_header' : JSONType.Bool().default_value(false),
    
    'config' : {
        'text' : TEXT_CONFIG,
        'number' : NUMBER_CONFIG,
        'checkbox' : CHECKBOX_CONFIG,
        'select' : SELECT_CONFIG,
        'array' : ARRAY_CONFIG,
        'struct' : STRUCT_CONFIG,
    }
}

export default FORM_JSON_TREE;
                    
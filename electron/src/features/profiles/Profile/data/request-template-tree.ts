import { JSONType, StorageAccess } from "ac-storage";

const REQUEST_TEMPLATE_TREE = {
    'index.json' : StorageAccess.JSON({
        'tree' : JSONType.Array(),
        'ids' : JSONType.Array(),
    }),
    '*' : {
        'index.json' : StorageAccess.JSON({
            'id' : JSONType.String(),
            'name' : JSONType.String(),
            'uuid' : JSONType.String(),
            'mode' : JSONType.Union('prompt_only', 'flow').default_value('prompt_only'),
            'input_type' : JSONType.Union('normal', 'chat').default_value('normal'),
        }),
        'form.json' : StorageAccess.JSON({
            '*' : {
                'id' : JSONType.String(),
                'type' : JSONType.Union('text', 'number', 'boolean', 'select', 'multi_select', 'file', 'image_url').default_value('text'),
                'name' : JSONType.String(),
                'display_on_header' : JSONType.Bool().default_value(false),
                
                'config' : {
                    'text' : {
                        'default_value' : JSONType.String().default_value(''),
                        'placeholder' : JSONType.String(),
                        'allow_multiline' : JSONType.Bool().default_value(false),
                    },
                    'number' : {
                        'default_value' : JSONType.Number().default_value(0),
                        'minimum_value' : JSONType.Number().nullable(),
                        'maximum_value' : JSONType.Number().nullable(),
                        'allow_decimal' : JSONType.Bool().default_value(false),
                    },
                    'checkbox' : {
                        'default_value' : JSONType.Bool().default_value(false),
                    },
                    'select' : {
                        'default_value' : JSONType.String(),
                        'options' : JSONType.Array({
                            'name' : JSONType.String(),
                            'value' : JSONType.String(),
                        }),
                    },
                    'array' : {
                        'minimum_length' : JSONType.Number().nullable(),
                        'maximum_length' : JSONType.Number().nullable(),
                        'element_type' : JSONType.Union('text', 'number', 'checkbox', 'select', 'struct').default_value('text'),
                    },
                    'struct' : {
                        fields : JSONType.Array({}),
                    }
                }
            }
        }),
        'flow.json' : StorageAccess.JSON({
            'nodes' : JSONType.Array({
                'id' : JSONType.Number(),
                'node' : JSONType.String(),
                'option' : JSONType.Struct(),
                'link_to' : {
                    '*' : JSONType.Array({
                        'id' : JSONType.Number(),
                        'input' : JSONType.String(),
                    }),
                },
                'addition' : {
                    'x' : JSONType.Number(),
                    'y' : JSONType.Number(),
                },
            }),
            'entrypoint_node' : JSONType.Number(),
        }),
        'prompts' : {
            '*' : StorageAccess.JSON({
                'id' : JSONType.String(),
                'name' : JSONType.String(),
                'input_type' : JSONType.Union('normal', 'chat'),
                'forms' : JSONType.Array(),
                'contents' : JSONType.String(),
            }),
        },
    }
}

export default REQUEST_TEMPLATE_TREE;
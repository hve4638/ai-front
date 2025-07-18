import { JSONType, StorageAccess } from "ac-storage";
import FORM_JSON_TREE from "./form-json-tree";

const REQUEST_TEMPLATE_TREE = {
    'index.json': StorageAccess.JSON({
        'tree': JSONType.Array(),
        'ids': JSONType.Array(),
    }),
    '*': {
        'index.json': StorageAccess.JSON({
            'version': JSONType.String().default_value('1.0.0'),
            'id': JSONType.String(),
            'name': JSONType.String(),
            'uuid': JSONType.String(),
            'mode': JSONType.Union('prompt_only', 'flow').default_value('prompt_only'),
            'input_type': JSONType.Union('normal', 'chat').default_value('normal'),
            'forms': JSONType.Array(JSONType.String()), // form 순서
            'entrypoint_node': JSONType.Number(),
        }),
        'form.json': StorageAccess.JSON({
            // key : formId
            '*': FORM_JSON_TREE,
        }),
        'node.json': StorageAccess.JSON({
            '*': {
                'id': JSONType.Number(),
                'node': JSONType.Union(
                    'input', 'output',
                    'prompt', 'chatai-fetch',
                    'stringify-chatml',
                ),
                'option': JSONType.Struct(),
                'forms': JSONType.Array({
                    'id': JSONType.String(),
                    'external_id': JSONType.String().nullable(),
                }),
                'link_to': {
                    // key : output interface nmae
                    '*': JSONType.Array({
                        'node_id': JSONType.Number(),
                        'input': JSONType.String(),
                    }),
                },
                'addition': {
                    'x': JSONType.Number().default_value(0),
                    'y': JSONType.Number().default_value(0),
                },
            },
        }),
        'prompts': {
            // key : promptId
            '*': StorageAccess.JSON({
                'id': JSONType.String(),
                'name': JSONType.String(),

                'model': {
                    'top_p': JSONType.Number().default_value(0.7),
                    'temperature': JSONType.Number().default_value(1),
                    'max_tokens': JSONType.Number().default_value(1024),
                    'use_thinking': JSONType.Bool().default_value(false),
                    'thinking_tokens': JSONType.Number().default_value(1024),
                },
                'variables': JSONType.Array({
                    'name': JSONType.String(),
                    'form_id': JSONType.String(),
                    'weak': JSONType.Bool().default_value(false),
                }),
                'constants': JSONType.Array({
                    'name': JSONType.String(),
                    'value': JSONType.Any(),
                }),
                'contents': JSONType.String(),
            }),
        },
    }
}

export default REQUEST_TEMPLATE_TREE;
import { JSONType, StorageAccess } from 'ac-storage';
import REQUEST_TEMPLATE_TREE from './request-template-tree';

const API_KEYS_ELEMENT = {
    secret_id: JSONType.String(),
    display_name: JSONType.String(),
    activate: JSONType.Bool(),
    type: JSONType.Union('primary', 'secondary'),
    last_access: JSONType.Number(),
    memo: JSONType.String().nullable(),
};

export const PROFILE_STORAGE_TREE = {
    'request-template': REQUEST_TEMPLATE_TREE,
    'session': {
        '*': {
            'data.json': StorageAccess.JSON({
                'forms': {
                    // key : rt id
                    '*': {
                        // key : form id
                        '*': JSONType.Any(),
                    }
                },
                'custom_models': JSONType.Array({
                    name: JSONType.String(),
                    url: JSONType.String(),
                    api_format: JSONType.Union('chat_completions', 'anthropic_claude', 'generative_language'),
                    secret_key: JSONType.String().nullable(),
                }).strict(),
            }),
            'config.json': StorageAccess.JSON({
                'name': JSONType.String(),
                'color': JSONType.String(),
                'model_id': JSONType.String(),
                'rt_id': JSONType.String(),
                'delete_lock': JSONType.Bool(),
            }),
            'cache.json': StorageAccess.JSON({
                'input': JSONType.String(),
                'output': JSONType.String(),

                'last_history': JSONType.Struct().nullable(),
                'state': JSONType.String(),
                'markdown': JSONType.Bool().default_value(true),
                'upload_files': JSONType.Array({
                    'filename': JSONType.String(),
                    'data': JSONType.String(),
                    'size': JSONType.Number(),
                    'type': JSONType.Union('image/webp', 'image/png', 'image/jpeg', 'application/pdf', 'text/plain'),
                    'thumbnail': JSONType.String().nullable(),
                    'hash_sha256': JSONType.String(),
                }).nullable().strict(),
            }),
            'history': StorageAccess.Custom('history'),
        }
    },
    'cache.json': StorageAccess.JSON({
        'last_session_id': JSONType.String(),
        'setting_models_show_featured': JSONType.Bool().default_value(true),
        'setting_models_show_snapshot': JSONType.Bool().default_value(false),
        'setting_models_show_experimental': JSONType.Bool().default_value(false),
        'setting_models_show_deprecated': JSONType.Bool().default_value(false),

        'removed_sessions': JSONType.Array(JSONType.String()).strict(),

        'history_search_scope': JSONType.Union('any', 'input', 'output').default_value('any'),
        'history_apply_rt': JSONType.Bool().default_value(false),
        'history_apply_model': JSONType.Bool().default_value(false),
        'history_apply_form': JSONType.Bool().default_value(false),

        'forms': {
            // key: rt id
            '*': {
                // key: form id
                '*': JSONType.Any(),
            }
        }
    }),
    'data.json': StorageAccess.JSON({
        'sessions': JSONType.Array(JSONType.String()).strict(),
        'starred_models': JSONType.Array(),
        'api_keys': {
            'openai': JSONType.Array(API_KEYS_ELEMENT).strict(),
            'anthropic': JSONType.Array(API_KEYS_ELEMENT).strict(),
            'google': JSONType.Array(API_KEYS_ELEMENT).strict(),
            'vertexai': JSONType.Array(API_KEYS_ELEMENT).strict(),
            'custom': JSONType.Array(API_KEYS_ELEMENT).strict(),
        },
        'custom_models': JSONType.Array({
            'id': JSONType.String(),
            'name': JSONType.String(),
            'model': JSONType.String(),
            'url': JSONType.String(),
            'thinking': JSONType.Bool().default_value(false),
            'api_format': JSONType.Union('chat_completions', 'anthropic_claude', 'generative_language'),
            'secret_key': JSONType.String().nullable(),
        }).strict(),
    }),
    'config.json': StorageAccess.JSON({
        'name': JSONType.String(),
        'color': JSONType.String(),
        'font_size': JSONType.Number(),
        'theme_mode': JSONType.Union('auto', 'light', 'dark').default_value('auto'),
        'layout_mode': JSONType.Union('vertical', 'horizontal').default_value('horizontal'),
        'history_enabled': JSONType.Bool(),
        'textarea_padding': JSONType.Number().default_value(8),
        'textarea_io_ratio': JSONType.Array(JSONType.Number()).nullable(), // [input_rate, output_rate]

        'max_history_limit_per_session': JSONType.Number(),
        'max_history_storage_days': JSONType.Number(),
        'remember_deleted_session_count': JSONType.Number(),
        'show_actual_model_name': JSONType.Bool(),
        'only_starred_models': JSONType.Bool(),
        'confirm_on_session_close': JSONType.Bool(),
        'global_shortcut_enabled': JSONType.Bool(),

        'clear_on_submit_normal': JSONType.Bool().default_value(false),
        'clear_on_submit_chat': JSONType.Bool().default_value(true),
    }),
    'shortcuts.json': StorageAccess.JSON(),
    'metadata.json': StorageAccess.JSON({

    }),
    'secret.json': StorageAccess.Custom('secret-json'),
    'unique': StorageAccess.Custom('secret-json'),
    'thumbnail': StorageAccess.Binary(),
}

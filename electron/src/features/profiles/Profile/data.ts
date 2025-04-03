import { JSONType, StorageAccess } from 'ac-storage';

export const PROFILE_STORAGE_TREE = {
    'request-template' : {
        'index.json' : StorageAccess.JSON({
            'tree' : JSONType.Array(),
            'ids' : JSONType.Array(),
        }),
        '*' : {
            'index.json' : StorageAccess.JSON({
                'id' : JSONType.String(),
                'name' : JSONType.String(),
                'mode' : JSONType.String()
            }),
            'prompts' : {
                '*' : StorageAccess.JSON({
                    'id' : JSONType.String(),
                    'name' : JSONType.String(),
                    'input_type' : JSONType.String(),
                    'forms' : JSONType.Array(),
                    'contents' : JSONType.String(),
                }),
            },
        }
    },
    'session' : {
        '*' : {
            'data.json' : StorageAccess.JSON({
                
            }),
            'config.json' : StorageAccess.JSON({
                'name' : JSONType.String(),
                'color' : JSONType.String(),
                'model_id' : JSONType.String(),
                'rt_id' : JSONType.String(),
                'delete_lock' : JSONType.Bool(),
            }),
            'cache.json' : StorageAccess.JSON({
                'input' : JSONType.String(),
                'output' : JSONType.String(),
                'token_count' : JSONType.Number(),
                'warning_message' : JSONType.String(),
            }),
            'history' : StorageAccess.Custom('history'),
        }
    },
    'cache.json' : StorageAccess.JSON({
        'last_session_id' : JSONType.String(),
        'setting_models_show_featured' : JSONType.Bool(),
        'setting_models_show_snapshot' : JSONType.Bool(),
        'setting_models_show_experimental' : JSONType.Bool(),
        'setting_models_show_deprecated' : JSONType.Bool(),
        'prompt_variables' : JSONType.Struct(),
        'removed_sessions' : JSONType.Array(),
    }),
    'data.json' : StorageAccess.JSON({
        'sessions' : JSONType.Array(),
        'starred_models' : JSONType.Array(),
        'api_keys' : {
            'openai' : JSONType.Array(),
            'anthropic' : JSONType.Array(),
            'google' : JSONType.Array(),
            'vertexai' : JSONType.Array(),
        }
    }),
    'config.json' : StorageAccess.JSON({
        'name' : JSONType.String(),
        'color' : JSONType.String(),
        'font_size' : JSONType.Number(),
        'theme_mode' : JSONType.String(),
        'layout_mode' : JSONType.String(),
        'history_enabled' : JSONType.Bool(),
        'max_history_limit_per_session' : JSONType.Number(),
        'max_history_storage_days' : JSONType.Number(),
        'remember_deleted_session_count' : JSONType.Number(),
        'show_actual_model_name' : JSONType.Bool(),
        'only_starred_models' : JSONType.Bool(),
        'confirm_on_session_close' : JSONType.Bool(),
        'global_shortcut_enabled' : JSONType.Bool(),
    }),
    'shortcut.json' : StorageAccess.JSON(),
    'metadata.json' : StorageAccess.JSON({

    }),
    'secret.json' : StorageAccess.Custom('secret-json'),
    'unique' : StorageAccess.Custom('secret-json'),
    'thumbnail' : StorageAccess.Binary(),
}
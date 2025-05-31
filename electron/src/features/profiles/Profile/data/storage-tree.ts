import { JSONType, StorageAccess } from 'ac-storage';
import REQUEST_TEMPLATE_TREE from './request-template-tree';

export const PROFILE_STORAGE_TREE = {
    'request-template' : REQUEST_TEMPLATE_TREE,
    'session' : {
        '*' : {
            'data.json' : StorageAccess.JSON({
                'forms' : {
                    // key : rt id
                    '*' : {
                        // key : form id
                        '*' : JSONType.Any(),
                    }
                }
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
                'state' : JSONType.String(),
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

        'removed_sessions' : JSONType.Array(JSONType.String()).strict(),
        
        'history_search_scope' : JSONType.Union('any', 'input', 'output').default_value('any'),
        'history_apply_rt' : JSONType.Bool().default_value(false),
        'history_apply_model' : JSONType.Bool().default_value(false),
        'history_apply_form' : JSONType.Bool().default_value(false),

        'forms' : {
            // key : rt id
            '*' : {
                // key : form id
                '*' : JSONType.Any(),
            }
        }
    }),
    'data.json' : StorageAccess.JSON({
        'sessions' : JSONType.Array(JSONType.String()).strict(),
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
        'theme_mode' : JSONType.Union('auto', 'light', 'dark').default_value('auto'),
        'layout_mode' : JSONType.Union('vertical', 'horizontal').default_value('horizontal'),
        'history_enabled' : JSONType.Bool(),
        'textarea_padding' : JSONType.Number().default_value(8),
        'textarea_io_ratio' : JSONType.Array(JSONType.Number()).nullable(), // [input_rate, output_rate]

        'max_history_limit_per_session' : JSONType.Number(),
        'max_history_storage_days' : JSONType.Number(),
        'remember_deleted_session_count' : JSONType.Number(),
        'show_actual_model_name' : JSONType.Bool(),
        'only_starred_models' : JSONType.Bool(),
        'confirm_on_session_close' : JSONType.Bool(),
        'global_shortcut_enabled' : JSONType.Bool(),
    }),
    'shortcuts.json' : StorageAccess.JSON(),
    'metadata.json' : StorageAccess.JSON({

    }),
    'secret.json' : StorageAccess.Custom('secret-json'),
    'unique' : StorageAccess.Custom('secret-json'),
    'thumbnail' : StorageAccess.Binary(),
}

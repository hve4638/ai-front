import { JSONType, StorageAccess } from 'ac-storage';

export const PROFILE_STORAGE_TREE = {
    'request-template' : {
        'index.json' : StorageAccess.JSON({
            'tree' : JSONType.object,
            'ids' : JSONType.array,
        }),
        '*' : {
            'index.json' : StorageAccess.JSON({
                'id' : JSONType.string,
                'name' : JSONType.string,
                'mode' : JSONType.string,
            }),
            'prompts' : {
                '*' : StorageAccess.JSON({
                    'id' : JSONType.string,
                    'name' : JSONType.string,
                    'inputType' : JSONType.string,
                    'forms' : JSONType.array,
                    'contents' : JSONType.string,
                }),
            },
        }
    },
    'session' : {
        '*' : {
            'data.json' : StorageAccess.JSON({
                'sessions' : JSONType.array,
            }),
            'config.json' : StorageAccess.JSON({
                'removed_session_limit' : JSONType.number,
            }),
            'cache.json' : StorageAccess.JSON({
                'removed_sessions' : JSONType.array,
            }),
            'history' : StorageAccess.Custom('history'),
        }
    },
    'cache.json' : StorageAccess.JSON({
        'last_session_id' : JSONType.string,
        'setting_models_show_featured' : JSONType.boolean,
        'setting_models_show_snapshot' : JSONType.boolean,
        'setting_models_show_experimental' : JSONType.boolean,
        'setting_models_show_deprecated' : JSONType.boolean,
    }),
    'data.json' : StorageAccess.JSON({
        'sessions' : JSONType.array,
        'starred_models' : JSONType.array,
    }),
    'config.json' : StorageAccess.JSON({
        'name' : JSONType.string,
        'color' : JSONType.string,
        'show_actual_model_name' : JSONType.boolean,
        'only_starred_models' : JSONType.boolean,
        'confirm_on_session_close' : JSONType.boolean,
    }),
    'shortcut.json' : StorageAccess.JSON(),
    'metadata.json' : StorageAccess.JSON({

    }),
    'thumbnail' : StorageAccess.Binary(),
}
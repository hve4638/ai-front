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
    'shortcut.json' : StorageAccess.JSON(),
    'cache.json' : StorageAccess.JSON(),
    'data.json' : StorageAccess.JSON(),
    'config.json' : StorageAccess.JSON(),
    'metadata.json' : StorageAccess.JSON(),
    'thumbnail' : StorageAccess.Binary(),
}
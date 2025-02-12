import { JSONType, StorageAccess } from '@hve/fs-storage';

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
            'data.json' : StorageAccess.JSON(),
            'config.json' : StorageAccess.JSON(),
            'cache.json' : StorageAccess.JSON(),
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
import { StorageAccess } from '@hve/fs-storage';

export const PROFILE_STORAGE_TREE = {
    'request-template' : {
        'index.json' : StorageAccess.JSON(),
        '*' : {
            'index.json' : StorageAccess.JSON(),
            '*' : StorageAccess.Union(
                StorageAccess.Text(),
                StorageAccess.JSON()
            )
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
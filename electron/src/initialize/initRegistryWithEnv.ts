import * as path from 'node:path';
import { app } from 'electron';

import { AfronEnv } from '@/runtime/types';
import { formatDateLocal } from '@/utils';
import runtime, { updateRegistry } from '@/runtime';

import { ACStorage, IACStorage, JSONType, MemACStorage, StorageAccess } from 'ac-storage';

import MasterKeyManager, { MasterKeyInitResult, MockMasterKeyManager } from '@/features/master-key';
import Profiles from '@/features/profiles';
import ProgramPath from '@/features/program-path';

type InitRegistryProps = {
    programPath: ProgramPath;
}

export async function initRegistryWithEnv({ programPath }: InitRegistryProps) {
    let globalStorage: IACStorage;
    let masterKeyManager: MasterKeyManager;
    
    if (runtime.env.inMemory) {
        runtime.logger.debug(`IN MEMORY STORAGE`);
        globalStorage = new MemACStorage();
        masterKeyManager = new MockMasterKeyManager();
    }
    else {
        globalStorage = new ACStorage(programPath.basePath);
        masterKeyManager = new MasterKeyManager(path.join(programPath.basePath, 'unique'));
    }

    globalStorage.register({
        'profiles': StorageAccess.Custom('profiles'),
        'config.json': StorageAccess.JSON({
            'shared_mode': JSONType.Bool().default_value(false),
        }),
        'cache.json': StorageAccess.JSON({
            'lastsize': JSONType.Array(),
        }),
    });
    globalStorage.addAccessEvent('profiles', {
        async init(actualPath) {
            return await Profiles.From(actualPath);
        },
        async save(ac) {
            await ac.saveAll();
        }
    });

    const profiles = await globalStorage.access('profiles', 'profiles') as Profiles;
    if (!(masterKeyManager instanceof MasterKeyManager)) {
        throw new Error('Initialization failed : masterKeyManager');
    }
    if (!(profiles instanceof Profiles)) {
        throw new Error('Initialization failed : profiles');
    }

    updateRegistry({
        profiles,
        globalStorage,
        masterKeyManager,
    });
}
import * as path from 'node:path';
import { openElectronApp } from './electron';
import { initIPC } from './ipc';
import {
    migrateLegacyProfile,
} from './features/program-path';
import ProgramPath from './features/program-path';
import { setRegistry } from './ipc/registry';
 
import { personal, localAppdata } from 'win-known-folders';
import { ACStorage, IACStorage, JSONType, MemACStorage, StorageAccess } from 'ac-storage';
import FetchContainer from '@features/fetch-container';
import Profiles from '@features/profiles';
import UniqueKeyManager, { MockUniqueKeyManager } from '@features/unique-key';

const documentPath = personal('cp949') ?? process.env['USERPROFILE']+'/documents' ?? './';
const programPath = new ProgramPath(path.join(documentPath, 'Afron'));

const localAppdataPath = localAppdata('cp949');
const uniqueKeyPath = (localAppdataPath != null) ? path.join(localAppdataPath, 'Afron') : './secret';

function getEnv(envName:string):boolean {
    const envField = process.env[`ELECTRON_${envName}`] ?? '';
    return (envField === '1' || envField.toUpperCase() == 'TRUE');
}

const inMemoryStorageMode = getEnv('IN_MEMORY');
const devMode = getEnv('DEV');

async function main() {
    programPath.makeRequiredDirectory();
    
    let globalStorage: IACStorage;
    if (inMemoryStorageMode) {
        console.log('in-memory storage');
        globalStorage = new MemACStorage();
    }
    else {
        globalStorage = new ACStorage(programPath.basePath);
    }

    globalStorage.register({
        'profiles' : StorageAccess.Custom('profiles'),
        'cache.json' : StorageAccess.JSON({
            'lastsize' : JSONType.array,
        }),
        'unique' : StorageAccess.Custom('unique-key'),
    });
    globalStorage.addAccessEvent('profiles', {
        init(actualPath) {
            return new Profiles(actualPath);
        },
        save(ac) {
            ac.saveAll();
        }
    });

    const uniqueKeyManager = new UniqueKeyManager(uniqueKeyPath);
    const profiles = globalStorage.access('profiles', 'profiles') as Profiles;
    if (!(uniqueKeyManager instanceof UniqueKeyManager)) {
        throw new Error('Initialization failed : uniqueKeyManager');
    }
    if (!(profiles instanceof Profiles)) {
        throw new Error('Initialization failed : profiles');
    }

    const fetchContainer = new FetchContainer();

    setRegistry({
        fetchContainer,
        globalStorage,
        profiles,
        uniqueKeyManager,
    })
    const appDependencies = {
        globalStorage,
        profiles,
        uniqueKeyManager,
    }
    const appOptions = {
        devMode : devMode,
        devUrl : 'http://localhost:3600',
    }
    initIPC();
    openElectronApp(appDependencies, appOptions);
}

main();


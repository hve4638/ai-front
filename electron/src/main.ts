import * as path from 'node:path';
import { personal, localAppdata } from 'win-known-folders';
import { ACStorage, IACStorage, JSONType, MemACStorage, StorageAccess } from 'ac-storage';

import { setRegistry } from '@/registry';
import { initIPC } from '@/ipc';
 
import ProgramPath from '@/features/program-path';
import Profiles from '@/features/profiles';
import MasterKeyManager, { MockMasterKeyManager } from '@/features/master-key';
import FetchContainer from '@/features/fetch-container';
import RTWorker from '@/features/rt-worker';
import ElectronApp from '@/features/elctron-app';

const documentPath = personal('cp949') ?? process.env['USERPROFILE']+'/documents' ?? './';
const programPath = new ProgramPath(path.join(documentPath, 'Afron'));

function getEnv(envName:string):boolean {
    const envField = process.env[`ELECTRON_${envName}`] ?? '';
    return (envField === '1' || envField.toUpperCase() == 'TRUE');
}

const inMemoryStorageMode = getEnv('IN_MEMORY');
const devMode = getEnv('DEV');

async function main() {
    programPath.makeRequiredDirectory();

    await initRegistry();
    initIPC();

    const electronApp = new ElectronApp({
        devMode : devMode,
        devUrl : 'http://localhost:3600',
    });
    // const win = await electronApp.buildBrowserWindow();
    await electronApp.run();
}

async function initRegistry() {
    let globalStorage: IACStorage;
    let masterKeyManager:MasterKeyManager;
    if (inMemoryStorageMode) {
        console.log('IN MEMORY STORAGE');
        globalStorage = new MemACStorage();
        masterKeyManager = new MockMasterKeyManager();
    }
    else {
        globalStorage = new ACStorage(programPath.basePath);
        masterKeyManager = new MasterKeyManager(path.join(programPath.basePath, 'unique'));
    }

    globalStorage.register({
        'profiles' : StorageAccess.Custom('profiles'),
        'cache.json' : StorageAccess.JSON({
            'lastsize' : JSONType.Array(),
        }),
    });
    globalStorage.addAccessEvent('profiles', {
        async init(actualPath) {
            return new Profiles(actualPath);
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

    const fetchContainer = new FetchContainer();
    const rtWorker = new RTWorker();
    setRegistry({
        fetchContainer,
        globalStorage,
        profiles,
        masterKeyManager,
        rtWorker,
    });
}

main();


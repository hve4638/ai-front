import * as path from 'node:path';
import { openElectronApp } from './electron';
import { initIPC } from './ipc';
import ProgramPath from './features/program-path';
import { setRegistry } from './registry';
 
import { personal, localAppdata } from 'win-known-folders';
import { ACStorage, IACStorage, JSONType, MemACStorage, StorageAccess } from 'ac-storage';
import FetchContainer from '@/features/fetch-container';
import Profiles from '@/features/profiles';
import MasterKeyManager, { MockMasterKeyManager } from '@/features/master-key';

const documentPath = personal('cp949') ?? process.env['USERPROFILE']+'/documents' ?? './';
const programPath = new ProgramPath(path.join(documentPath, 'Afron'));

function getEnv(envName:string):boolean {
    const envField = process.env[`ELECTRON_${envName}`] ?? '';
    return (envField === '1' || envField.toUpperCase() == 'TRUE');
}

const inMemoryStorageMode = getEnv('IN_MEMORY');
const devMode = getEnv('DEV');

async function main() {
    console.log('ENTRYPOINT');
    programPath.makeRequiredDirectory();
    
    let globalStorage: IACStorage;
    let masterKeyManager:MasterKeyManager;
    if (inMemoryStorageMode) {
        console.log('in-memory storage');
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

    setRegistry({
        fetchContainer,
        globalStorage,
        profiles,
        masterKeyManager,
    })
    const appDependencies = {
        globalStorage,
        profiles,
        masterKeyManager,
    }
    const appOptions = {
        devMode : devMode,
        devUrl : 'http://localhost:3600',
    }
    initIPC();
    await openElectronApp(appDependencies, appOptions);
}

main();


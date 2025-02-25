import * as path from 'node:path';
import { openElectronApp } from './electron';
import { initIPC } from './ipc';
import {
    migrateLegacyProfile,
} from './features/program-path';
import ProgramPath from './features/program-path';
import { setRegistry } from './ipc/registry';
 
import { personal, localAppdata } from 'win-known-folders';
import { ACStorage, JSONType, StorageAccess } from 'ac-storage';
import FetchContainer from '@features/fetch-container';
import Profiles from '@features/profiles';
import UniqueKeyManager from '@features/unique-key';

const documentPath = personal('cp949') ?? process.env['USERPROFILE']+'/documents' ?? './';
const programPath = new ProgramPath(path.join(documentPath, 'Afron'));

const localAppdataPath = localAppdata('cp949');
const uniqueKeyPath = (localAppdataPath != null) ? path.join(localAppdataPath, 'Afron') : './secret';

async function main() {
    programPath.makeRequiredDirectory();
    
    const uniqueKeyManager = new UniqueKeyManager(uniqueKeyPath);

    const profiles = new Profiles(programPath.profilePath);
    const globalStorage = new ACStorage(programPath.basePath);
    
    const fetchContainer = new FetchContainer();
    
    globalStorage.register({
        'profiles' : StorageAccess.Custom('profiles'),
        'cache.json' : StorageAccess.JSON({
            'lastsize' : JSONType.array,
        }),
    });
    globalStorage.addAccessEvent('profiles', {
        init(actualPath: string) {
            return new Profiles(actualPath);
        },
        destroy: function (ac: unknown, actualPath: string, ...args: any[]): void {
            
        }
    });

    setRegistry({
        fetchContainer,
        globalStorage,
        profiles,
        uniqueKeyManager,
    })
    const appDependencies = {
        fetchContainer,
        globalStorage,
        profiles,
        uniqueKeyManager,
    }
    const appOptions = {
        devMode : process.env['ELECTRON_DEV'] === 'TRUE',
        devUrl : 'http://localhost:3600',
    }
    initIPC();
    openElectronApp(appDependencies, appOptions);
}

main();
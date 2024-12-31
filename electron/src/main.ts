import * as path from 'node:path';
import { openElectronApp } from './electron';
import { initIPC } from './ipc';
import {
    migrateLegacyProfile,
} from './features/program-path';
import ProgramPath from './features/program-path';

import FetchContainer from './features/fetch-container';
import Storage, { StorageAccess } from './features/storage';
import Profiles from './features/profiles';
import { personal, localAppdata } from 'win-known-folders';
import UniqueKeyManager from './features/unique-key';

const documentPath = personal('cp949') ?? process.env['USERPROFILE']+'/documents' ?? './';
const programPath = new ProgramPath(path.join(documentPath, 'Afron'));

const localAppdataPath = localAppdata('cp949');
const uniqueKeyPath = (localAppdataPath != null) ? path.join(localAppdataPath, 'Afron') : './secret';

async function main() {
    programPath.makeRequiredDirectory();
    
    const uniqueKeyManager = new UniqueKeyManager(uniqueKeyPath);

    const profiles = new Profiles(programPath.profilePath);
    const globalStorage = new Storage(programPath.basePath);
    const fetchContainer = new FetchContainer();
    
    globalStorage.register({
        'cache.json' : StorageAccess.JSON,
        'profiles' : {
            'index.json' : StorageAccess.JSON,
        }
    });
    globalStorage.setAlias('cache', 'cache.json');
    
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
    initIPC(appDependencies);
    openElectronApp(appDependencies, appOptions);
}


main();
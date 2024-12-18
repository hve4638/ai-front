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

const programPath = new ProgramPath(path.join(process.env['USERPROFILE']!, 'Documents', 'Afron'));

programPath.makeRequiredDirectory();

const profiles = new Profiles(programPath.profilePath);
const globalStorage = new Storage(programPath.basePath);
const fetchContainer = new FetchContainer();

globalStorage.register({
    'cache.json' : StorageAccess.JSON,
});

const appDependencies = {
    fetchContainer,
    globalStorage,
    profiles,
}
const appOptions = {
    devMode : process.env['ELECTRON_DEV'] === 'TRUE',
    devUrl : 'http://localhost:3600',
}

initIPC(appDependencies);
openElectronApp(appDependencies, appOptions);
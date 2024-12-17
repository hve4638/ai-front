import * as path from 'node:path';
import { openElectronApp } from './electron';
import { initIPC } from './ipc';

import {
    migrateLegacyProfile,
} from './features/program-path';
import ProgramPath from './features/program-path';

import FetchContainer from './features/fetch-container';
import GlobalStorage from './features/global-storage';
import Profiles from './features/profiles';

const programPath = new ProgramPath(path.join(process.env['USERPROFILE']!, 'Documents', 'Afron'));

programPath.makeDirectory();

// v0.6 이전 버전의 폴더 구조 마이그레이션
// migrateLegacyProfile();

const profiles = new Profiles(programPath.profilePath);
const globalStorage = new GlobalStorage(programPath.basePath);
const fetchContainer = new FetchContainer();

// 허용된 globalStorage 설정
// 등록된 storage만 프론트엔드에서 IPC를 통해 접근할 수 있음
globalStorage.registerStorage('cache', 'cache.json');

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
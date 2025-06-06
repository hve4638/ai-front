import * as path from 'node:path';
import { personal, localAppdata } from 'win-known-folders';
import { ACStorage, IACStorage, JSONType, MemACStorage, StorageAccess } from 'ac-storage';

import runtime, { updateRegistry } from '@/runtime';
import { initIPC } from '@/ipc';

import ProgramPath from '@/features/program-path';
import Profiles from '@/features/profiles';
import MasterKeyManager, { MasterKeyInitResult, MockMasterKeyManager } from '@/features/master-key';
import RTWorker from '@/features/rt-worker';
import ElectronApp from '@/features/elctron-app';
import 'dotenv/config'
import AppVersionManager from './features/app-version';
import MigrationAIFront from './features/migration-service';

const documentPath = personal('cp949') ?? process.env['USERPROFILE'] + '/documents' ?? './';
const programPath = new ProgramPath(path.join(documentPath, 'Afron'));


function getEnv(envName: string): string | undefined {
    return process.env[`ELECTRON_${envName}`];
}
function getEnvAsBoolean(envName: string): boolean {
    const envField = process.env[`ELECTRON_${envName}`] ?? '';
    return (
        envField === '1' ||
        envField.toUpperCase() == 'TRUE' ||
        envField.toUpperCase() == 'T'
    );
}

async function main() {
    programPath.makeRequiredDirectory();

    const migration = new MigrationAIFront();
    console.log(migration.existsLegacyData());
    const legacyData = await migration.extract();
    console.log(legacyData);

    await initRegistry();
    initIPC();
    await initOptional();

    const electronApp = new ElectronApp();
    await electronApp.run();
}

async function initRegistry() {
    const env = {
        dev: getEnvAsBoolean('DEV'), // 파일 대신 URL에서 프론트엔드 로드
        devUrl: getEnv('DEV_URL') ?? 'http://localhost:3600', // DEV 모드에서 프론트엔드 URL
        inMemory: getEnvAsBoolean('IN_MEMORY'), // 휘발성 모드
        skipMasterKeyInitialization: getEnvAsBoolean('SKIP_MASTER_KEY_INITAILIZATION'), // 마스터키 초기화 생략
        showDevTool: getEnvAsBoolean('SHOW_DEVTOOL'), // 실행시 개발자 도구 열기
        defaultProfile: getEnvAsBoolean('DEFAULT_PROFILE'), // 초기 프로필이 미리 생성됨
        defaultRT: getEnvAsBoolean('DEFAULT_RT'), // 초기 RT가 미리 생성됨
        version: getEnv('VERSION') ?? 'unknown',
    }

    let globalStorage: IACStorage;
    let masterKeyManager: MasterKeyManager;
    if (env.inMemory) {
        console.log('IN MEMORY STORAGE');
        globalStorage = new MemACStorage();
        masterKeyManager = new MockMasterKeyManager();
    }
    else {
        globalStorage = new ACStorage(programPath.basePath);
        masterKeyManager = new MasterKeyManager(path.join(programPath.basePath, 'unique'));
    }

    globalStorage.register({
        'profiles': StorageAccess.Custom('profiles'),
        'cache.json': StorageAccess.JSON({
            'lastsize': JSONType.Array(),
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

    const rtWorker = new RTWorker();
    const appVersionManager = new AppVersionManager(env.version);
    const migrationService = new MigrationAIFront();
    updateRegistry({
        globalStorage,
        profiles,
        masterKeyManager,
        rtWorker,
        appVersionManager,
        migrationService,
        env,
    });
}

async function initOptional() {
    const ipcFrontAPI = runtime.ipcFrontAPI;

    if (runtime.env.skipMasterKeyInitialization) {
        console.info('SKIP MASTER KEY INITIALIZATION');

        const initResult = await runtime.masterKeyManager.init();
        switch (initResult) {
            case MasterKeyInitResult.Normal:
            case MasterKeyInitResult.NormalWithWarning:
                return;
        }
        await runtime.masterKeyManager.mockResetKey('12345');
    }
    if (runtime.env.defaultProfile) {
        console.info('DEFAULT PROFILE CREATION');

        const profiles = runtime.profiles;
        const ids = profiles.getProfileIDs();

        if (ids.length > 0) return;
        const [_, pid] = await ipcFrontAPI.profiles.create();
        const profileId = pid as string;
        await ipcFrontAPI.profiles.setLast(profileId);
        await ipcFrontAPI.profileStorage.set(profileId, 'config.json', {
            name: 'default',
        });

        if (runtime.env.defaultRT) {
            console.info('DEFAULT RT CREATION');
            await ipcFrontAPI.profileRTs.createUsingTemplate(profileId, {
                name: 'chat',
                id: 'chat-rt',
                mode: 'prompt_only',
            }, 'chat');
            await ipcFrontAPI.profileRTs.createUsingTemplate(profileId, {
                name: 'Debug',
                id: 'default-rt',
                mode: 'prompt_only',
            }, 'debug');
        }
    }
}

main();
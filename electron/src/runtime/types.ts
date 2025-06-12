import type { IACStorage } from 'ac-storage';
import type MasterKeyManager from '@/features/master-key';
import type Profiles from '@/features/profiles';
import type RTWorker from '@/features/rt-worker';
import AppVersionManager from '@/features/app-version';
import MigrationService from '@/features/migration-service';
import Logger from '@/features/logger';

export type RuntimeRegistry = {
    profiles: Profiles;
    globalStorage: IACStorage;
    masterKeyManager: MasterKeyManager;
    rtWorker: RTWorker;
    ipcFrontAPI: IPCInvokerInterface;
    appVersionManager: AppVersionManager;
    migrationService: MigrationService;
    logger: Logger;
    version: string;
    env: AfronEnv;
}

export type PartialRuntimeRegistry = Partial<RuntimeRegistry> & {
    env?: Partial<AfronEnv>,
}

export type AfronEnv = {
    dev: boolean,
    devUrl: string,
    showDevTool: boolean,
    inMemory: boolean,
    skipMasterKeyInitialization: boolean,
    defaultProfile: boolean,
    defaultRT: boolean,
    logTrace: boolean,
    logVerbose: boolean,
}
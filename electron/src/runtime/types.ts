import type { IACStorage } from 'ac-storage';
import type MasterKeyManager from '@/features/master-key';
import type Profiles from '@/features/profiles';
import type RTWorker from '@/features/rt-worker';

export type RuntimeRegistry = {
    profiles: Profiles;
    globalStorage: IACStorage;
    masterKeyManager: MasterKeyManager;
    rtWorker: RTWorker;
    ipcFrontAPI: IPCInvokeIntrerface;
    env: Env;
}

export type PartialRuntimeRegistry = Partial<RuntimeRegistry> & {
    env?: Partial<Env>,
}

export type Env = {
    dev: boolean,
    devUrl: string,
    showDevTool: boolean,
    inMemory: boolean,
    skipMasterKeyInitialization: boolean,
    defaultProfile: boolean,
    defaultRT: boolean,
}
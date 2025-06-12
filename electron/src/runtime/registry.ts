import { PartialRuntimeRegistry, RuntimeRegistry } from './types';

export const registry:RuntimeRegistry = {
    profiles: null as any,
    globalStorage: null as any,
    masterKeyManager: null as any,
    rtWorker: null as any,
    ipcFrontAPI: null as any,
    appVersionManager : null as any,
    migrationService: null as any,
    logger: null as any,
    version: 'unknown',
    env: {
        dev: false,
        devUrl : 'http://localhost:3600',
        inMemory: false,
        showDevTool: false,
        skipMasterKeyInitialization: false,
        defaultProfile: false,
        defaultRT: false,
        logTrace: false,
        logVerbose: false,
    },
};

export function updateRegistry(newRegistry: PartialRuntimeRegistry) {
    for (const [key, value] of Object.entries(newRegistry)) {
        if (key in registry) {
            if (key === 'env' && value) {
                Object.assign(registry.env, value);
            }
            else {
                registry[key] = value;
            }
        }
    }
}
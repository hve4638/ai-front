import * as path from 'node:path';
import { personal, localAppdata } from 'win-known-folders';
import { ACStorage, IACStorage, JSONType, MemACStorage, StorageAccess } from 'ac-storage';
import { app } from 'electron';
import dotenv from 'dotenv';

import runtime, { updateRegistry } from '@/runtime';
import { initIPC } from '@/ipc';

import { MasterKeyManager, MasterKeyInitResult, MockMasterKeyManager } from '@afron/core';

export async function initDevOptions() {
    if (app.isPackaged) return; // 개발 환경에서만 동작

    const ipcFrontAPI = runtime.ipcFrontAPI;

    if (runtime.env.skipMasterKeyInitialization) {
        console.info('SKIP MASTER KEY INITIALIZATION');

        const initResult = await runtime.masterKeyManager.init();
        switch (initResult) {
            case MasterKeyInitResult.Normal:
            case MasterKeyInitResult.NormalWithWarning:
                return;
        }
        await runtime.masterKeyManager.mockResetKey('c2c18cc943278a04f0d50267eaa665c70da33618b7f995a1887e6de7f4c901b6');
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
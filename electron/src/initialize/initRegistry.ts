import { app } from 'electron';

import { formatDateLocal } from '@/utils';
import runtime, { updateRegistry } from '@/runtime';

import RTWorker from '@/features/rt-worker';
import AppVersionManager from '@/features/app-version';
import MigrationAIFront from '@/features/migration-service';
import Logger, { LogLevel } from '@/features/logger';
import ProgramPath from '@/features/program-path';

type InitRegistryProps = {
    programPath: ProgramPath;
}

export async function initRegistry({ programPath }: InitRegistryProps) {
    const version = app.isPackaged ? app.getVersion() : `dev-${formatDateLocal()}`;
    
    const logLevel = (
        (app.isPackaged) ? LogLevel.INFO
        : (runtime.env.logTrace) ? LogLevel.TRACE :
        LogLevel.DEBUG
    )
    const logger = new Logger(
        programPath.logPath,
        {
            verbose: runtime.env.logVerbose,
            level: logLevel,
        },
    );
    updateRegistry({ logger });
    
    updateRegistry({
        rtWorker: new RTWorker(),
        appVersionManager: new AppVersionManager(version),
        migrationService: new MigrationAIFront(),
        version,
    });
}
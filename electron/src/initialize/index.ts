import * as fs from 'node:fs';
import * as path from 'node:path';
import { initAfronEnv } from './initAfronEnv'
import { initRegistry } from './initRegistry'
import { initDevOptions } from './initDevOptions'
import { initIPC } from '@/ipc'
import ProgramPath from '@/features/program-path';
import { personal } from 'win-known-folders';
import { initRegistryWithEnv } from './initRegistryWithEnv';
import { formatDateLocal } from '@/utils';
import { app } from 'electron';


async function initialize() {
    const documentPath = personal('cp949') ?? process.env['USERPROFILE'] + '/documents' ?? './';
    const programPath = new ProgramPath(path.join(documentPath, 'Afron'));

    programPath.makeRequiredDirectory();
    
    if (!app.isPackaged) {
        try {
            fs.cpSync(path.join(programPath.basePath, 'profiles', 'profiles.json'), path.join(programPath.basePath, 'logs', `profiles-${formatDateLocal()}.json`));
        }
        catch (error) {
            console.warn('Failed to copy profiles.json to logs directory:', error);
        }
    }
    
    initAfronEnv();
    await initRegistry({ programPath });
    await initRegistryWithEnv({ programPath });
    initIPC();
    await initDevOptions();
}


export default initialize;
import { app } from 'electron';

import {} from '@afron/core';
import ElectronApp from '@/features/elctron-app';
import { showMessage } from '@/utils';
import initialize from '@/initialize';

const gotLocked = app.requestSingleInstanceLock();

async function main() {
    if (gotLocked === false) {
        console.error('Afron is already running.');
        if (!app.isPackaged) showMessage('Afron is already running.');
        process.exit(0);
    }
    
    await initialize();

    const electronApp = new ElectronApp();
    await electronApp.run();
}

main();
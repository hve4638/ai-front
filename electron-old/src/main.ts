import * as path from 'node:path';

import { app, BrowserWindow, Menu, shell, Tray } from 'electron';
import electronLocalshortcut from 'electron-localshortcut';
//const electronLocalshortcut = require('electron-localshortcut');
import {
    createRequiredPath,
    migrateLegacyProfile,
    aiFrontPath,
} from './store';
import { initIPC } from './ipcHandle';
import FetchContainer from './fetch-container';
import Profiles from './profiles';

//const FetchContainer = require('./fetch-container');
//const Profiles = require('./profiles');

const FAVICON_PATH = path.join(__dirname, '../static/favicon.ico');
const DEV_URL = 'http://localhost:3000';
const STATIC_ENTRYPOINT = path.join(__dirname, '../static/index.html');
const PRELOAD_PATH = path.join(__dirname, 'preload.js');

createRequiredPath();
migrateLegacyProfile();

const profiles = new Profiles(aiFrontPath.profilesDirectoryPath);
const fetchContainer = new FetchContainer();

initIPC({
    fetchContainer,
    profiles
});

function createWindow() {
    const win = new BrowserWindow({
        width: 1280,
        height: 900,
        minWidth: 500,
        minHeight: 500,
        icon: FAVICON_PATH,
        webPreferences: {
            preload: PRELOAD_PATH,
            nodeIntegration: true,
            contextIsolation: true
        }
    })

    if (process.env['DEV'] === 'TRUE') {
        win.loadURL(DEV_URL);
    }
    else {
        win.loadURL(`file://${STATIC_ENTRYPOINT}`);
    }
    Menu.setApplicationMenu(null);

    electronLocalshortcut.register(win, 'F5', () => {
        win.reload();
    });
    electronLocalshortcut.register(win, 'F12', () => {
        win.webContents.toggleDevTools();
    });
}

app.whenReady().then(() => {
    createWindow();
})

app.on('window-all-closed', function () {
    profiles.saveAll();
    app.quit();
});


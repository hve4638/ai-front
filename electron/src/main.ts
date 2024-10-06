import * as path from 'node:path';
import { app, BrowserWindow, Menu, shell, Tray, globalShortcut } from 'electron';
import {
    createRequiredPath,
    migrateLegacyProfile,
    aiFrontPath,
} from './store';
import { initIPC } from './ipc';
import FetchContainer from './fetch-container';
import Profiles from './profiles';

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

    if (process.env['ELECTRON_DEV'] === 'TRUE') {
        console.log(`Entrypoint : ${DEV_URL}`);
    
        win.webContents.openDevTools({ mode: "detach" });
        globalShortcut.register('F5', () => {
            win.reload();
        });
        globalShortcut.register('F11', () => {
            win.webContents.toggleDevTools();
        });
        
        win.loadURL(DEV_URL);
    }
    else {
        console.log(`Entrypoint : file://${STATIC_ENTRYPOINT}`);
        win.loadURL(`file://${STATIC_ENTRYPOINT}`);
    }
    Menu.setApplicationMenu(null);
    // electronLocalshortcut.register(win, 'F5', () => {
    //     win.reload();
    // });
    // electronLocalshortcut.register(win, 'F12', () => {
    //     win.webContents.toggleDevTools();
    // });
}

app.whenReady().then(() => {
    createWindow();
})

app.on('window-all-closed', function () {
    profiles.saveAll();
    app.quit();
});


import * as path from 'node:path';
import { app, BrowserWindow, Menu, globalShortcut } from 'electron';
import * as electronLocalshortcut from 'electron-localshortcut';
import { throttle } from './utils';

import type FetchContainer from './features/fetch-container';
import type Profiles from './features/profiles';
import { type FSStorage } from '@hve/fs-storage';

const FAVICON_PATH = path.join(__dirname, '../static/favicon.ico');
const STATIC_ENTRYPOINT = path.join(__dirname, '../static/index.html');
const PRELOAD_PATH = path.join(__dirname, 'preload.js');

interface ElectronAppDependencies {
    fetchContainer:FetchContainer,
    globalStorage:FSStorage,
    profiles:Profiles,
}

interface ElectronAppOptions {
    devMode? : boolean;
    devUrl?: string;
}

export function openElectronApp(
    dependencies: ElectronAppDependencies,
    options : ElectronAppOptions
) {
    const {
        fetchContainer,
        globalStorage,
        profiles
    } = dependencies;
    const {
        devMode = false,
        devUrl = ''
    } = options;
    
    const cacheAccessor = globalStorage.getJSONAccessor('cache') ?? [1280, 900];
    const [width, height] = cacheAccessor.get('lastsize') ?? [1280, 900];
    const [minWidth, minHeight] = [500, 500];

    function createWindow() {
        const win = new BrowserWindow({
            width, height,
            minWidth, minHeight,
            icon: FAVICON_PATH,
            webPreferences: {
                preload: PRELOAD_PATH,
                nodeIntegration: true,
                contextIsolation: true
            }
        })
    
        if (devMode) {
            console.log(`DEV MODE`);
            console.log(`Entrypoint : ${devUrl}`);

            electronLocalshortcut.register(win, 'F12', () => {
                win.webContents.toggleDevTools();
            });
            
            win.loadURL(devUrl);
        }
        else {
            win.loadURL(`file://${STATIC_ENTRYPOINT}`);
        }
        Menu.setApplicationMenu(null);

        const throttledResize = throttle(100);
        win.on('resize', ()=>{
            const [width, height] = win.getSize();
            throttledResize(()=>{
                cacheAccessor.set('lastsize', [width, height]);
            });
        });
        
        electronLocalshortcut.register(win, 'F5', () => {
            win.reload();
        });
    }
    
    app.on('window-all-closed', function () {
        globalStorage.commit();
        profiles.saveAll();
        app.quit();
    });
    
    app.whenReady().then(() => {
        createWindow();
    })
}
import { app, BrowserWindow, Menu, globalShortcut, ipcMain } from 'electron';
import * as electronLocalshortcut from 'electron-localshortcut';
import { throttle } from './utils';

import type Profiles from './features/profiles';
import { IACStorage } from 'ac-storage';

import * as staticPath from './static-path'
import { IPCListenerPing } from './data';

interface ElectronAppDependencies {
    globalStorage:IACStorage,
    profiles:Profiles,
}

interface ElectronAppOptions {
    devMode? : boolean;
    devUrl?: string;
}

export async function openElectronApp(
    dependencies: ElectronAppDependencies,
    options : ElectronAppOptions
) {
    const {
        globalStorage,
        profiles
    } = dependencies;
    const {
        devMode = false,
        devUrl = ''
    } = options;
    
    const cacheAccessor = await globalStorage.accessAsJSON('cache.json');
    const [width, height] = cacheAccessor.getOne('lastsize') ?? [1280, 900];
    const [minWidth, minHeight] = [500, 500];

    function createWindow() {
        const win = new BrowserWindow({
            width, height,
            minWidth, minHeight,
            icon: staticPath.FAVICON,
            webPreferences: {
                preload: staticPath.PRELOAD,
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
            win.loadURL(`file://${staticPath.STATIC_ENTRYPOINT}`);
        }
        Menu.setApplicationMenu(null);

        const throttledResize = throttle(100);
        win.on('resize', ()=>{
            const [width, height] = win.getSize();
            throttledResize(()=>{
                cacheAccessor.setOne('lastsize', [width, height]);
            });
        });
        
        electronLocalshortcut.register(win, 'F5', () => {
            win.reload();
        });

        // console.log('registering shortcuts');
        // setInterval(()=>{
        //     win.webContents.send(IPCListenerPing.Request, 'Hello!');
        //     console.log('hello?')
        // }, 200);
    }
    
    app.on('window-all-closed', async function() {
        await globalStorage.commitAll();
        await profiles.saveAll();
        app.quit();
    });
    
    app.whenReady().then(() => {
        createWindow();
    })
}
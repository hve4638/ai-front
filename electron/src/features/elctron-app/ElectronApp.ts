import { app, BrowserWindow, Menu, globalShortcut, ipcMain } from 'electron';
import * as electronLocalshortcut from 'electron-localshortcut';
import { throttle } from '@/utils';
import * as registry from '@/registry';

import * as staticPath from '@/static-path'

interface ElectronAppOptions {
    devMode? : boolean;
    devUrl?: string;
}

const MINIMUM_WINDOW_SIZE = [640, 520];
const DEFAULT_WINDOW_SIZE = [1280, 900];

class ElectronApp {
    win:BrowserWindow|null = null;

    constructor(
        protected options: ElectronAppOptions
    ) {

    }

    private async buildBrowserWindow():Promise<BrowserWindow> {
        const cacheAC = await registry.globalStorage.accessAsJSON('cache.json');
        const [width, height] = cacheAC.getOne('lastsize') ?? DEFAULT_WINDOW_SIZE;
        const [minWidth, minHeight] = MINIMUM_WINDOW_SIZE;

        this.win = new BrowserWindow({
            width, height,
            minWidth, minHeight,
            icon: staticPath.FAVICON,
            webPreferences: {
                preload: staticPath.PRELOAD,
                nodeIntegration: true,
                contextIsolation: true
            }
        });
        return this.win;
    }

    async run() {
        await app.whenReady();
        await this.buildBrowserWindow();

        if (this.win == null) {
            throw new Error('BrowserWindow is not created yet. Call buildBrowserWindow() first.');
        }
        const win = this.win;
        registry.rtWorker.setBrowserWindowRef(new WeakRef(win));
        const {
            devMode,
            devUrl = ''
        } = this.options;
        const cacheAC = await registry.globalStorage.accessAsJSON('cache.json');


        if (devMode) {
            console.log(`DEV MODE`);
            console.log(`Entrypoint : ${devUrl}`);

            electronLocalshortcut.register(win, 'F12', () => {
                win.webContents.toggleDevTools();
            });
            electronLocalshortcut.register(win, 'F5', () => {
                win.reload();
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
                cacheAC.setOne('lastsize', [width, height]);
            });
        });
        
        app.on('window-all-closed', async function() {
            try {
                await registry.globalStorage.commitAll();
                await registry.profiles.saveAll();
            }
            finally {
                app.quit();
            }
        });
    }
}

export default ElectronApp;
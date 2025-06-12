import { app, BrowserWindow, Menu, globalShortcut, ipcMain } from 'electron';
import * as electronLocalshortcut from 'electron-localshortcut';
import { throttle } from '@/utils';
import runtime from '@/runtime';

import * as staticPath from '@/static-path';

const MINIMUM_WINDOW_SIZE = [640, 520];
const DEFAULT_WINDOW_SIZE = [1280, 900];

class ElectronApp {
    win: BrowserWindow | null = null;

    private async buildBrowserWindow(): Promise<BrowserWindow> {
        const cacheAC = await runtime.globalStorage.accessAsJSON('cache.json');
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
            runtime.logger.fatal('BrowserWindow is not created.');
            process.exit(1);
        }
        runtime.logger.info('Afron is starting...');

        const win = this.win;
        runtime.rtWorker.setBrowserWindowRef(new WeakRef(win));

        const {
            dev, devUrl, showDevTool
        } = runtime.env;
        const cacheAC = await runtime.globalStorage.accessAsJSON('cache.json');

        if (dev) {
            runtime.logger.debug(`DEV MODE`);
            runtime.logger.debug(`Entrypoint: ${devUrl}`);

            electronLocalshortcut.register(win, 'F12', () => {
                win.webContents.toggleDevTools();
            });
            electronLocalshortcut.register(win, 'F5', () => {
                win.reload();
            });

            win.loadURL(devUrl);

            if (showDevTool) {
                win.webContents.openDevTools({ mode: 'detach' });
            }
        }
        else {
            runtime.logger.debug(`RELEASE MODE`);
            runtime.logger.debug(`Entrypoint: file://${staticPath.STATIC_ENTRYPOINT}`);

            win.loadURL(`file://${staticPath.STATIC_ENTRYPOINT}`);

            if (showDevTool) {
                win.webContents.openDevTools({ mode: 'detach' });
            }
        }
        Menu.setApplicationMenu(null);

        const throttledResize = throttle(100);
        win.on('resize', () => {
            const [width, height] = win.getSize();
            throttledResize(() => {
                runtime.logger.debug(`Window resized: ${width}x${height}`);
                
                cacheAC.setOne('lastsize', [width, height]);
            });
        });

        win.on('close', async (event) => {
            runtime.logger.info('Window closed');
            this.win = null;
        });

        app.on('window-all-closed', async function () {
            runtime.logger.info('All windows closed, quitting app');
            try {
                globalShortcut.unregisterAll();
                await runtime.globalStorage.commitAll();
                await runtime.profiles.saveAll();
            }
            finally {
                app.quit();
                runtime.logger.info('Exit');
            }
        });

        app.on('will-quit', () => {
            globalShortcut.unregisterAll();
        });
    }
}

export default ElectronApp;
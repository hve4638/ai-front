const path = require('path');

const { app, BrowserWindow, Menu, shel, Tray, Menu } = require('electron');
const electronLocalshortcut = require('electron-localshortcut');

const store = require('./store');

const { initIPC } = require('./ipcHandle');

const FetchContainer = require('./fetch-container');
const Profiles = require('./profiles');

store.createRequiredPath();
store.migrateLegacyProfile();

const profiles = new Profiles(store.path.profilesDirectoryPath);
const fetchContainer = new FetchContainer();

const faviconPath = path.join(__dirname, '../build/favicon.ico');

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
        icon: faviconPath,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: true
        }
    })

    if (process.env.DEV === 'TRUE') {
        win.loadURL('http://localhost:3000');
    }
    else {
        win.loadFile(`${path.join(__dirname, '../build/index.html')}`);
    }
    Menu.setApplicationMenu(null);

    electronLocalshortcut.register(win, 'F5', () => {
        win.reload();
    });
    electronLocalshortcut.register(win, 'F12', () => {
        win.webContents.toggleDevTools();
    });
}

function createTrayIcon() {
    const tray = new Tray(faviconPath);
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Quit',
            click: () => {
                app.quit();
            }
        }
    ]);
    tray.setContextMenu(contextMenu);
    tray.setToolTip('Wordbook');
    console.log('Tray icon created');
}

app.whenReady().then(() => {
    createTrayIcon();
    createWindow();
})

app.on('window-all-closed', function () {
    profiles.saveAll();
    app.quit();
});


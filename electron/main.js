const { app, BrowserWindow, Menu, ipcMain, shell } = require('electron');
const electronLocalshortcut = require('electron-localshortcut');
const path = require('path');
const fs = require('fs');
const { default: fetch } = require('node-fetch-cjs');
const ipcping = require('./ipc');
const utils = require('./utils');
const prompttemplate = require('./prompt-template');
const store = require('./store');
const { HistoryManager } = require('./history');
const vmplugin = require('./vmplugin');

let plainDataThrottle = utils.throttle(500);
let secretDataThrottle = utils.throttle(500);
let plainData = {};
let secretData = {};

store.createBasePath();

const historyManager = new HistoryManager(store.historyDirectoryPath);

plainData = store.readConfigData() ?? {};
secretData = store.readSecretData() ?? {};

function createWindow() {
    const win = new BrowserWindow({
        width: 1280,
        height: 900,
        minWidth: 500,
        minHeight: 500,
        icon: path.join(__dirname, '../build/favicon.ico'),
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
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

app.whenReady().then(() => {
    prompttemplate.initialize(store.promptDirectoryPath);

    createWindow();
})

app.on('window-all-closed', function () {
    store.writeConfigData(plainData);
    store.writeSecretData(secretData);
    historyManager.close();
    app.quit()
})

ipcMain.handle(ipcping.ECHO, (event, arg) => {
    console.log('ECHO: ' + arg);
    return arg;
});

ipcMain.handle(ipcping.OPEN_PROMPT_FOLDER, (event, arg) => {
    try {
        fs.mkdirSync(store.promptDirectoryPath, { recursive: true });
        shell.openPath(store.promptDirectoryPath);
    } catch (err) {

    }
});

ipcMain.handle(ipcping.LOAD_PROMPTLIST, (event, args) => {
    return store.readPromptList();
})

ipcMain.handle(ipcping.LOAD_PROMPT, (event, value) => {
    return store.readPromptContents(value);
})

ipcMain.handle(ipcping.STORE_VALUE, (event, name, value) => {
    plainDataThrottle(() => store.writeConfigData(plainData));

    plainData[name] = value;
})

ipcMain.handle(ipcping.LOAD_VALUE, (event, name) => {
    if (name in plainData) {
        return plainData[name];
    }
    else {
        return null;
    }
})

ipcMain.handle(ipcping.STORE_SECRET_VALUE, (event, name, value) => {
    secretDataThrottle(() => store.writeSecretData(secretData));

    secretData[name] = value;
})

ipcMain.handle(ipcping.LOAD_SECRET_VALUE, (event, name) => {
    if (name in secretData) {
        return secretData[name];
    }
    else {
        return null;
    }
})

ipcMain.handle(ipcping.FETCH, async (event, url, init) => {
    try {
        const res = await fetch(url, init);
        const data = await res.json();

        if (!res.ok) {
            return {
                ok: false,
                type: "http",
                reason: JSON.stringify(data),
                status: res.status
            }
        }
        else {
            return {
                ok: true,
                type: "normal",
                data: data
            }
        }
    }
    catch (error) {
        return {
            ok: false,
            type: "other",
            reason: "Unexpected Error",
            error: `${error}`
        }
    }
})

ipcMain.handle(ipcping.OPEN_BROWSER, async (event, url) => {
    utils.openBrowser(url);
})

ipcMain.handle(ipcping.RESET_ALL_VALUES, async (event) => {
    secretData = {}
    plainData = {}
    store.writeConfigData(plainData);
    store.writeSecretData(secretData);
})


ipcMain.handle(ipcping.LOAD_HISTORY, async (event, key, offset, limit) => {
    const item = historyManager.get(key, offset, limit);
    return item;
})

ipcMain.handle(ipcping.STORE_HISTORY, async (event, key, data) => {
    historyManager.append(key, data);
})

ipcMain.handle(ipcping.DELETE_HISTORY, async (event, key) => {
    historyManager.drop(key);
})
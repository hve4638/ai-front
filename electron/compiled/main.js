"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("node:path"));
const electron_1 = require("electron");
const store_1 = require("./store");
const ipc_1 = require("./ipc");
const fetch_container_1 = __importDefault(require("./fetch-container"));
const profiles_1 = __importDefault(require("./profiles"));
const FAVICON_PATH = path.join(__dirname, '../static/favicon.ico');
const DEV_URL = 'http://localhost:3000';
const STATIC_ENTRYPOINT = path.join(__dirname, '../static/index.html');
const PRELOAD_PATH = path.join(__dirname, 'preload.js');
(0, store_1.createRequiredPath)();
(0, store_1.migrateLegacyProfile)();
const profiles = new profiles_1.default(store_1.aiFrontPath.profilesDirectoryPath);
const fetchContainer = new fetch_container_1.default();
(0, ipc_1.initIPC)({
    fetchContainer,
    profiles
});
function createWindow() {
    const win = new electron_1.BrowserWindow({
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
    });
    if (process.env['ELECTRON_DEV'] === 'TRUE') {
        console.log(`Entrypoint : ${DEV_URL}`);
        win.webContents.openDevTools({ mode: "detach" });
        electron_1.globalShortcut.register('F5', () => {
            win.reload();
        });
        electron_1.globalShortcut.register('F11', () => {
            win.webContents.toggleDevTools();
        });
        win.loadURL(DEV_URL);
    }
    else {
        console.log(`Entrypoint : file://${STATIC_ENTRYPOINT}`);
        win.loadURL(`file://${STATIC_ENTRYPOINT}`);
    }
    electron_1.Menu.setApplicationMenu(null);
    // electronLocalshortcut.register(win, 'F5', () => {
    //     win.reload();
    // });
    // electronLocalshortcut.register(win, 'F12', () => {
    //     win.webContents.toggleDevTools();
    // });
}
electron_1.app.whenReady().then(() => {
    createWindow();
});
electron_1.app.on('window-all-closed', function () {
    profiles.saveAll();
    electron_1.app.quit();
});

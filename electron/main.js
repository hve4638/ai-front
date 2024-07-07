const { app, BrowserWindow, Menu, ipcMain, shell  } = require('electron');
const electronLocalshortcut = require('electron-localshortcut');
const path = require('path');
const fs = require('fs');
const { default: fetch, Headers } = require('node-fetch-cjs');
const ipcping = require('./ipc');
const utils = require('./utils');
const prompttemplate = require('./prompt-template');

const documentsPath = app.getPath('documents');
const saveFolderPath = path.join(documentsPath, "AIFront");
const promptFolderPath = path.join(saveFolderPath, "prompts");
const configFilePath = path.join(saveFolderPath, "config.json");
const secretFilePath = path.join(saveFolderPath, "secret.json");

let plainDataThrottle = utils.throttle(500);
let secretDataThrottle = utils.throttle(500);
let plainData = {};
let secretData = {};

function createWindow() { 
  const win = new BrowserWindow({ 
    width: 1280, 
    height: 900,
    icon: path.join(__dirname, '../build/favicon.ico'),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration : true,
      contextIsolation : true
    }
  })

  if (process.env.DEV === 'TRUE') {
    win.loadURL('http://localhost:3000'); 
  }
  else {
    win.loadFile(`${path.join(__dirname,'../build/index.html')}`);
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
  fs.mkdirSync(saveFolderPath, { recursive: true });
  prompttemplate.initialize(promptFolderPath);
  if (fs.existsSync(configFilePath)) {
    const contents = fs.readFileSync(configFilePath, 'utf8');
    try { plainData = JSON.parse(contents); }
    catch {}
  }
  if (fs.existsSync(secretFilePath)) {
    const contents = fs.readFileSync(secretFilePath, 'utf8');
    try { secretData = JSON.parse(contents); }
    catch {}
  }

  createWindow();
}) 

app.on('window-all-closed', function () { 
  fs.writeFileSync(configFilePath, JSON.stringify(plainData), 'utf8');
  fs.writeFileSync(secretFilePath, JSON.stringify(secretData), 'utf8');
  app.quit() 
})

ipcMain.handle(ipcping.ECHO, (event, arg) => {
  console.log('ECHO: ' + arg);
  return arg;
});

ipcMain.handle(ipcping.OPEN_PROMPT_FOLDER, (event, arg) => {
  try {
    fs.mkdirSync(promptFolderPath, { recursive: true });
    shell.openPath(promptFolderPath);
  } catch (err) {

  }
});

ipcMain.handle(ipcping.LOAD_PROMPTLIST, (event, args) => {
  const targetPath = path.join(promptFolderPath, "list.json");

  return fs.readFileSync(targetPath, 'utf8');
})

ipcMain.handle(ipcping.LOAD_PROMPT, (event, args) => {
  const targetPath = path.join(promptFolderPath, args);

  return fs.readFileSync(targetPath, 'utf8');
})

ipcMain.handle(ipcping.STORE_VALUE, (event, name, value) => {
  plainDataThrottle(()=>{
    fs.writeFileSync(configFilePath, JSON.stringify(plainData), 'utf8');
  });
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
  secretDataThrottle(()=>{
    fs.writeFileSync(secretFilePath, JSON.stringify(secretData), 'utf8');
  });
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
  const res = await fetch(url, init);
  if (!res.ok) {
    throw data.error.message;
  }
  else {
    const data = await res.json();
    return data;
  }
})

ipcMain.handle(ipcping.OPEN_BROWSER, async (event, url) => {
  utils.openBrowser(url);
})

ipcMain.handle(ipcping.RESET_ALL_VALUES, async (event) => {
  fs.writeFileSync(secretFilePath, JSON.stringify(secretData), 'utf8');
  fs.writeFileSync(configFilePath, JSON.stringify(plainData), 'utf8');

  secretData = {}
  plainData = {}
})
const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const electronLocalshortcut = require('electron-localshortcut');
const ipcping = require('./src/data/ipc');
const path = require('path');
const fs = require('fs');

function createWindow () { 
  const win = new BrowserWindow({ 
    width: 1280, 
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration : true,
      contextIsolation : true
    }
  })
  const preloadPath = path.join(__dirname, "preload.js");
  console.log(`Preload path: ${preloadPath}`);

  if (process.env.DEV === 'TRUE') {
    win.loadURL('http://localhost:3000'); 
  }
  else {
    win.loadFile(`${path.join(__dirname,'./build/index.html')}`);
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
  createWindow() 
}) 

app.on('window-all-closed', function () { 
  if (process.platform !== 'darwin') app.quit() 
})

ipcMain.handle(ipcping.ECHO, (event, arg) => {
  console.log(arg);
  return arg;
});

ipcMain.handle(ipcping.OPEN_PROMPT_FOLDER, (event, arg) => {
  console.log(app.getPath('documents'));
  
});
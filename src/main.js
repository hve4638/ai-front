const { app, BrowserWindow, Menu, ipcMain } = require('electron')

function createWindow () { 
  const win = new BrowserWindow({ 
    width: 800, 
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    }
  })
  //win.loadURL('http://localhost:3000');
  win.loadFile('index.html');
  Menu.setApplicationMenu(null);
}
app.whenReady().then(() => { 
  createWindow() 
}) 
app.on('window-all-closed', function () { 
  if (process.platform !== 'darwin') app.quit() 
})
const { contextBridge, ipcRenderer } = require('electron');
const ipcping = require('./src/data/ipc.js');

contextBridge.exposeInMainWorld('electron', {
  echo: (message) => ipcRenderer.invoke(ipcping.ECHO, message),
});

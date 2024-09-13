const { contextBridge } = require('electron');
const api = require('./ipcapi');

contextBridge.exposeInMainWorld('electron', api);

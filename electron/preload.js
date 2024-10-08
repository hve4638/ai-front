const { contextBridge, ipcRenderer } = require('electron');
const ipcping = require('./ipc.js');

contextBridge.exposeInMainWorld('electron', {
  echo: (message) => ipcRenderer.invoke(ipcping.ECHO, message),
  openPromptFolder: () => ipcRenderer.invoke(ipcping.OPEN_PROMPT_FOLDER),
  /**
   * @deprecated
   */
  loadPromptList: () => ipcRenderer.invoke(ipcping.LOAD_PROMPTLIST),
  /**
   * Prompt 경로를 기준으로 prompt metadata를 가져옴
   * @param {string} path 
   * @returns {string} 
   */
  loadPromptMetadata: (path) => ipcRenderer.invoke(ipcping.LOAD_PROMPTMETADATA, path),
  loadPrompt: (value) => ipcRenderer.invoke(ipcping.LOAD_PROMPT, value),
  storeValue : (name, value) => ipcRenderer.invoke(ipcping.STORE_VALUE, name, value),
  loadValue : (name) => ipcRenderer.invoke(ipcping.LOAD_VALUE, name),
  storeSecretValue : (name, value) => ipcRenderer.invoke(ipcping.STORE_SECRET_VALUE, name, value),
  loadSecretValue : (name) => ipcRenderer.invoke(ipcping.LOAD_SECRET_VALUE, name),
  fetch : (url, init) => ipcRenderer.invoke(ipcping.FETCH, url, init),
  openBrowser : (url) => ipcRenderer.invoke(ipcping.OPEN_BROWSER, url),
  resetAllValues : () => ipcRenderer.invoke(ipcping.RESET_ALL_VALUES),
  loadHistory : (sessionid, offset, limit) => ipcRenderer.invoke(ipcping.LOAD_HISTORY, sessionid, offset, limit),
  storeHistory : (sessionid, history) => ipcRenderer.invoke(ipcping.STORE_HISTORY, sessionid, history),
  deleteHistory : (sessionid) => ipcRenderer.invoke(ipcping.DELETE_HISTORY, sessionid),
  executePlugin : (pluginPath) => ipcRenderer.invoke(ipcping.DELETE_HISTORY, sessionid),
});

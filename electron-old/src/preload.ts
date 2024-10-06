import { contextBridge, ipcRenderer } from 'electron';
import ipcping from './ipcping';

const api = {
    /**
     * @returns {[Error, string]}
     */
    echo: (message:any) => ipcRenderer.invoke(ipcping.ECHO, message),
    /**
     * @returns {[Error]}
    */ 
    openBrowser: (url:string) => ipcRenderer.invoke(ipcping.OPEN_BROWSER, url),
    /**
     * @returns {[Error]}
    */
    openPromptDirectory: () => ipcRenderer.invoke(ipcping.OPEN_PROMPT_DIRECTORY),
    /**
     * @returns {[Error, number]} fetch id
     */
    fetch: (url:string, init:Object) => ipcRenderer.invoke(ipcping.FETCH, url, init),
    /**
     * @returns {[Error]}
     */
    abortFetch: (fetchID:number) => ipcRenderer.invoke(ipcping.ABORT_FETCH, fetchID),
    /**
     * @returns {[Error, Response]}
     */
    getFetchResponse : (fetchID:number) => ipcRenderer.invoke(ipcping.GET_FETCH_RESPONSE, fetchID),
    

    /**
     * @returns {[Error, Object]} prompt metadata json 형식 Object
     */
    loadRootPromptMetadata : (profileName:string) => ipcRenderer.invoke(ipcping.LOAD_ROOT_PROMPT_METADATA, profileName),

    /**
     * @returns {[Error, Object]} prompt metadata json 형식 Object
     */
    loadModulePromptMetadata : (profileName:string, moduleName:string) => ipcRenderer.invoke(ipcping.LOAD_MODULE_PROMPT_METADATA, profileName, moduleName),

    /**
     * @returns {[Error, string]} prompt template 텍스트
     */
    loadPromptTemplate: (profileName:string, basePath:string, filename:string) => ipcRenderer.invoke(ipcping.LOAD_PROMPT_TEMPLATE, profileName, basePath, filename),

    /**
     * @returns {[Error, string[]]} profile 이름 목록
     */
    getProfileNames: () => ipcRenderer.invoke(ipcping.LOAD_PROFILE_LIST),

    /**
     * @param {string} profileName
     * @returns {[Error]}
     */
    createProfile: (profileName:string) => ipcRenderer.invoke(ipcping.CREATE_PROFILE, profileName),

    /**
     * @returns {[Error]}
     */
    deleteProfile: (profileName:string) => ipcRenderer.invoke(ipcping.DELETE_PROFILE, profileName),

    /**
     * 
     * @param {*} profileName 
     * @param {*} key 
     * @returns {[Error]}
     */
    loadProfileValue: (profileName, category, key) => ipcRenderer.invoke(ipcping.LOAD_PROFILE_VALUE, profileName, category, key),

    /**
     * @param {string} profileName 
     * @param {string} key 
     * @param {string} value 
     * @returns {[Error]}
     */
    storeProfileValue: (profileName, category, key, value) => ipcRenderer.invoke(ipcping.STORE_PROFILE_VALUE, profileName, category, key, value),

    /**
     * @param {string} profileName 
     * @param {string} historyName 
     * @param {number} offset 
     * @param {number} limit 
     * @returns {[Error, any[]]} { id:number, data:string }[]
     */
    loadProfileHistory: (profileName, historyName, offset, limit) => ipcRenderer.invoke(ipcping.LOAD_PROFILE_HISTORY, profileName, historyName, offset, limit),

    /**
     * @param {string} profileName 
     * @param {string} historyName 
     * @param {string} data 
     * @returns {[Error]}
     */
    storeProfileHistory: (profileName, historyName, data) => ipcRenderer.invoke(ipcping.STORE_PROFILE_HISTORY, profileName, historyName, data),

    /**
     * @param {string} profileName 
     * @param {string} historyName 
     * @param {number} id 
     * @returns {[Error]}
     */
    deleteProfileHistory: (profileName, historyName, id) => ipcRenderer.invoke(ipcping.DELETE_PROFILE_HISTORY, profileName, historyName, id),

    /**
     * @param {string} profileName 
     * @param {string} historyName 
     * @returns {[Error]}
     */
    deleteAllProfileHistory: (profileName, historyName) => ipcRenderer.invoke(ipcping.DELETE_ALL_PROFILE_HISTORY, profileName, historyName),

    loadLastProfileName: () => ipcRenderer.invoke(ipcping.LOAD_LAST_PRROFILE_NAME),
    
    updateLastProfileName: (profileName) => ipcRenderer.invoke(ipcping.UPDATE_LAST_PROFILE_NAME, profileName),
};

contextBridge.exposeInMainWorld('electron', api);

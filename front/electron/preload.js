const { contextBridge } = require('electron');
const { ipcRenderer } = require('electron');
const ipcping = require('./ipcping');
//const api = require('./ipcapi');

const api = {
    /**
     * @param {*} message 
     * @returns {[Error, string]}
     */
    echo: (message) => ipcRenderer.invoke(ipcping.ECHO, message),
    /**
     * @param {string} url
     * @returns {[Error]}
    */ 
    openBrowser: (url) => ipcRenderer.invoke(ipcping.OPEN_BROWSER, url),
    /**
     * @returns {[Error]}
    */
    openPromptDirectory: () => ipcRenderer.invoke(ipcping.OPEN_PROMPT_DIRECTORY),
    /**
     * 
     * @param {string} url 
     * @param {Object} init 
     * @returns {[Error, number]} fetch id
     */
    fetch: (url, init) => ipcRenderer.invoke(ipcping.FETCH, url, init),
    /**
     * @param {number} fetchID 
     * @returns {[Error]}
     */
    abortFetch: (fetchID) => ipcRenderer.invoke(ipcping.ABORT_FETCH, fetchID),
    /**
     * 
     * @param {number} fetchID 
     * @returns {[Error, Response]}
     */
    getFetchResponse : (fetchID) => ipcRenderer.invoke(ipcping.GET_FETCH_RESPONSE, fetchID),
    

    /**
     * @param {string} profileName
     * @returns {[Error, Object]} prompt metadata json 형식 Object
     */
    loadRootPromptMetadata : (profileName) => ipcRenderer.invoke(ipcping.LOAD_ROOT_PROMPT_METADATA, profileName),

    /**
     * @param {string} profileName
     * @param {string} moduleName
     * @returns {[Error, Object]} prompt metadata json 형식 Object
     */
    loadModulePromptMetadata : (profileName, moduleName) => ipcRenderer.invoke(ipcping.LOAD_MODULE_PROMPT_METADATA, profileName, moduleName),

    /**
     * @param {string} profileName
     * @param {string} basePath
     * @param {string} filename 
     * @returns {[Error, string]} prompt template 텍스트
     */
    loadPromptTemplate: (profileName, basePath, filename) => ipcRenderer.invoke(ipcping.LOAD_PROMPT_TEMPLATE, profileName, basePath, filename),

    /**
     * @returns {[Error, string[]]} profile 이름 목록
     */
    getProfileNames: () => ipcRenderer.invoke(ipcping.LOAD_PROFILE_LIST),

    /**
     * @param {string} profileName
     * @returns {[Error]}
     */
    createProfile: (profileName) => ipcRenderer.invoke(ipcping.CREATE_PROFILE, profileName),

    /**
     * @param {string} profileName
     * @returns {[Error]}
     */
    deleteProfile: (profileName) => ipcRenderer.invoke(ipcping.DELETE_PROFILE, profileName),

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

const { ipcMain, shell } = require('electron');

const ipcping = require('./ipcping');
const store = require('./store');
const utils = require('./utils');

const Profiles = require('./profiles');
const FetchContainer = require('./fetch-container');

/**
 * @param {Object} options
 * @param {FetchContainer} options.fetchContainer
 * @param {Profiles} options.profiles
 */
function initIPC({ fetchContainer, profiles }) {
    const trottles = {};
    
    ipcMain.handle(ipcping.ECHO, (event, message) => {
        return [null, message];
    });

    ipcMain.handle(ipcping.MESSAGE, (event, message) => {
        console.log(message);

        return [null, undefined];
    });

    ipcMain.handle(ipcping.OPEN_BROWSER, async (event, url) => {
        utils.openBrowser(url);

        return [null, undefined];
    });
    ipcMain.handle(ipcping.OPEN_PROMPT_DIRECTORY, (event) => {
        try {
            fs.mkdirSync(store.promptDirectoryPath, { recursive: true });
            shell.openPath(store.promptDirectoryPath);

            return [null];
        }
        catch (err) {
            return [makeErrorStruct(err)];
        }
    });


    ipcMain.handle(ipcping.FETCH, (event, url, init) => {
        try {
            const fetchId = fetchContainer.fetch(url, init);
            return [null, fetchId];
        }
        catch (error) {
            return [makeErrorStruct(error), null];
        }
    })

    ipcMain.handle(ipcping.ABORT_FETCH, (event, fetchId) => {
        fetchContainer.abort(fetchId);
    });

    ipcMain.handle(ipcping.GET_FETCH_RESPONSE, async (event, key) => {
        try {
            return [null, await fetchContainer.get(key)];
        }
        catch (error) {
            return [makeErrorStruct(error), null];
        }
    });

    ipcMain.handle(ipcping.LOAD_PROMPT_ROOTMETADATA, (event, args) => {
        try {
            const metadata = store.prompts.getRootMetadata();
            return [null, metadata];
        }
        catch (error) {
            return [makeErrorStruct(error), null];
        }
    })

    ipcMain.handle(ipcping.LOAD_PROMPT_METADATA, (event, moduleName) => {
        try {
            const metadata = store.prompts.getMetadata(moduleName);
            return [null, metadata];
        }
        catch (error) {
            return [makeErrorStruct(error), null];
        }
    });

    ipcMain.handle(ipcping.LOAD_PROMPT_TEMPLATE, (event, basePath, data) => {
        try {
            const metadata = store.prompts.getFileAsString(basePath, data);
            return [null, metadata];
        }
        catch (error) {
            return [makeErrorStruct(error), null];
        }
    });

    ipcMain.handle(ipcping.CREATE_PROFILE, (event, profileName) => {
        try {
            profiles.createProfile(profileName);

            return [null];
        }
        catch (error) {
            return [makeErrorStruct(error)];
        }
    });
    ipcMain.handle(ipcping.DELETE_PROFILE, (event) => {
        try {
            profiles.deleteProfile(profileName);
            return [null];
        }
        catch (error) {
            return [makeErrorStruct(error)];
        }
    });
    ipcMain.handle(ipcping.LOAD_PROFILE_LIST, (event) => {
        try {
            return [null, profiles.getProfileNames()];
        }
        catch (error) {
            return [makeErrorStruct(error), null];
        }
    });

    ipcMain.handle(ipcping.STORE_PROFILE_VALUE, (event, category, key, value) => {
        trottles[category] ??= utils.throttle(500);

        try {
            const profile = profiles.getProfile(profileName);
            profile.set(category, key, value);

            // 500ms throttle로 저장
            trottles[category](()=>{
                profile.save(category);
            })
            return [null];
        }
        catch (error) {
            return [makeErrorStruct(error)];
        }
    });
    ipcMain.handle(ipcping.LOAD_PROFILE_VALUE, (event, category, key) => {
        try {
            const profile = profiles.getProfile(profileName);
            const value = profile.get(category, key);
            return [null, value];
        }
        catch (error) {
            return [makeErrorStruct(error), null];
        }
    });

    
    ipcMain.handle(ipcping.STORE_PROFILE_HISTORY, (event, historyName, data) => {
        try {
            const profile = profiles.getProfile(profileName);
            profile.history.append(historyName, data);

            return [null];
        }
        catch (error) {
            return [makeErrorStruct(error)];
        }
    });
    ipcMain.handle(ipcping.LOAD_PROFILE_HISTORY, (event, historyName, offset, limit) => {
        try {
            const profile = profiles.getProfile(profileName);
            const data = profile.history.get(historyName, offset, limit);

            return [null, data];
        }
        catch (error) {
            return [makeErrorStruct(error)];
        }
    });
    ipcMain.handle(ipcping.DELETE_PROFILE_HISTORY, (event, historyName, id) => {
        try {
            const profile = profiles.getProfile(profileName);
            profile.history.delete(historyName, id);

            return [null];
        }
        catch (error) {
            return [makeErrorStruct(error)];
        }
    });
    
    ipcMain.handle(ipcping.DELETE_ALL_PROFILE_HISTORY, (event, historyName) => {
        try {
            const profile = profiles.getProfile(profileName);
            profile.history.drop(historyName);

            return [null];
        }
        catch (error) {
            return [makeErrorStruct(error)];
        }
    });

    ipcMain.handle(ipcping.EXECUTE_PLUGIN, (event) => {
        try {
            throw new Error('Not implemented');
        }
        catch (error) {
            return [false, makeErrorStruct(error)];
        }
    });
}

function makeErrorStruct(error) {
    try {
        return {
            name : error.name,
            message : error.message,
        }
    }
    catch(error) {
        return {
            name : 'UnknownError',
            message : 'Unknown error',
        }
    }
}

module.exports = {
    initIPC
};
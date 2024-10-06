import fs from 'fs';
import { ipcMain, shell } from 'electron';
import ipcping from './ipcping';
import { aiFrontPath } from './store';
import * as utils from './utils';
import Profiles from './profiles';
import FetchContainer from './fetch-container';

/**
 * @param {Object} options
 * @param {FetchContainer} options.fetchContainer
 * @param {Profiles} options.profiles
 */
export function initIPC({ fetchContainer, profiles }) {
    const trottles = {};
    
    ipcMain.handle(ipcping.ECHO, (event, message) => {
        console.log(message);
        
        return [null, message];
    });
    
    ipcMain.handle(ipcping.OPEN_BROWSER, async (event, url) => {
        utils.openBrowser(url);

        return [null];
    });
    ipcMain.handle(ipcping.OPEN_PROMPT_DIRECTORY, (event) => {
        try {
            fs.mkdirSync(aiFrontPath.promptsDirectoryPath, { recursive: true });
            shell.openPath(aiFrontPath.promptsDirectoryPath);

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
            return [makeErrorStruct(error)];
        }
    })

    ipcMain.handle(ipcping.ABORT_FETCH, async (event, fetchId) => {
        try {
            fetchContainer.abort(fetchId);
            return [null];
        }
        catch (error) {
            return [makeErrorStruct(error)];
        }
    });

    ipcMain.handle(ipcping.GET_FETCH_RESPONSE, async (event, fetchId) => {
        try {
            return [null, await fetchContainer.get(fetchId)];
        }
        catch (error) {
            return [makeErrorStruct(error)];
        }
    });


    ipcMain.handle(ipcping.LOAD_ROOT_PROMPT_METADATA, (event, profileName) => {
        try {
            const profile = profiles.getProfile(profileName);
            const metadata = profile.getRootPromptMetadata();
            return [null, metadata];
        }
        catch (error) {
            return [makeErrorStruct(error)];
        }
    })

    ipcMain.handle(ipcping.LOAD_MODULE_PROMPT_METADATA, (event, profileName, moduleName) => {
        try {
            const profile = profiles.getProfile(profileName);
            const metadata = profile.getModulePromptMetdata(moduleName);
            return [null, metadata];
        }
        catch (error) {
            return [makeErrorStruct(error)];
        }
    });

    ipcMain.handle(ipcping.LOAD_PROMPT_TEMPLATE, (event, profileName, basePath, data) => {
        try {
            const profile = profiles.getProfile(profileName);
            const template = profile.getPromptTemplate(basePath, data);
            return [null, template];
        }
        catch (error) {
            return [makeErrorStruct(error)];
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
    ipcMain.handle(ipcping.DELETE_PROFILE, (event, profileName:string) => {
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
            return [makeErrorStruct(error)];
        }
    });

    ipcMain.handle(ipcping.STORE_PROFILE_VALUE, (event, profileName, category, key, value) => {
        trottles[category] ??= utils.throttle(500);

        try {
            const profile = profiles.getProfile(profileName);
            profile.setValue(category, key, value);

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
    ipcMain.handle(ipcping.LOAD_PROFILE_VALUE, (event, profileName, category, key) => {
        try {
            const profile = profiles.getProfile(profileName);
            const value = profile.getValue(category, key);
            return [null, value];
        }
        catch (error) {
            return [makeErrorStruct(error)];
        }
    });

    
    ipcMain.handle(ipcping.LOAD_PROFILE_HISTORY, (event, profileName, historyName, offset, limit) => {
        try {
            const profile = profiles.getProfile(profileName);
            const data = profile.history.get(historyName, offset, limit);

            return [null, data];
        }
        catch (error) {
            return [makeErrorStruct(error)];
        }
    });
    ipcMain.handle(ipcping.STORE_PROFILE_HISTORY, (event, profileName, historyName, data) => {
        try {
            const profile = profiles.getProfile(profileName);
            profile.history.append(historyName, data);

            return [null];
        }
        catch (error) {
            return [makeErrorStruct(error)];
        }
    });
    ipcMain.handle(ipcping.DELETE_PROFILE_HISTORY, (event, profileName, historyName, id) => {
        try {
            const profile = profiles.getProfile(profileName);
            profile.history.delete(historyName, id);

            return [null];
        }
        catch (error) {
            return [makeErrorStruct(error)];
        }
    });
    
    ipcMain.handle(ipcping.DELETE_ALL_PROFILE_HISTORY, (event, profileName, historyName) => {
        try {
            const profile = profiles.getProfile(profileName);
            profile.history.drop(historyName);

            return [null];
        }
        catch (error) {
            return [makeErrorStruct(error)];
        }
    });

    ipcMain.handle(ipcping.LOAD_LAST_PRROFILE_NAME, (event) => {
        try {
            return [null, profiles.getLastProfileName()];
        }
        catch (error) {
            return [makeErrorStruct(error)];
        }
    });

    ipcMain.handle(ipcping.UPDATE_LAST_PROFILE_NAME, (event, profileName) => {
        try {
            profiles.setLastProfileName(profileName);
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

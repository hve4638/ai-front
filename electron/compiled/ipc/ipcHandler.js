"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIPCHandler = getIPCHandler;
const utils = __importStar(require("../utils"));
function getIPCHandler({ fetchContainer, profiles }) {
    const trottles = {};
    return {
        echo: async (message) => {
            console.log(message);
            return [null, message];
        },
        openBrowser: async (url) => {
            utils.openBrowser(url);
            return [null];
        },
        openPromptDirectory: async (profileName) => {
            throw new Error('Not implemented yet');
        },
        // Fetch 관련
        fetch: async (url, init) => {
            const fetchId = fetchContainer.fetch(url, init);
            return [null, fetchId];
        },
        abortFetch: async (fetchId) => {
            fetchContainer.abort(fetchId);
            return [null];
        },
        getFetchResponse: async (fetchId) => {
            return [null, await fetchContainer.get(fetchId)];
        },
        // Prompt 관련
        loadRootPromptMetadata: async (profileName) => {
            const profile = profiles.getProfile(profileName);
            const metadata = profile.getRootPromptMetadata();
            return [null, metadata];
        },
        loadModulePromptMetadata: async (profileName, moduleName) => {
            const profile = profiles.getProfile(profileName);
            const metadata = profile.getModulePromptMetdata(moduleName);
            return [null, metadata];
        },
        loadPromptTemplate: async (profileName, moduleName, filename) => {
            const profile = profiles.getProfile(profileName);
            const template = profile.getPromptTemplate(moduleName, filename);
            return [null, template];
        },
        // Profile 관련
        getProfileNames: async () => {
            return [null, profiles.getProfileNames()];
        },
        createProfile: async (profileName) => {
            profiles.createProfile(profileName);
            return [null];
        },
        deleteProfile: async (profileName) => {
            profiles.deleteProfile(profileName);
            return [null];
        },
        // Profile Storage 관련
        loadProfileValue: async (profileName, storageName, key) => {
            const profile = profiles.getProfile(profileName);
            const value = profile.getValue(storageName, key);
            return [null, value];
        },
        storeProfileValue: async (profileName, storageName, key, value) => {
            trottles[storageName] ??= utils.throttle(500);
            const profile = profiles.getProfile(profileName);
            profile.setValue(storageName, key, value);
            // 500ms throttle로 저장
            trottles[storageName](() => {
                profile.save();
            });
            return [null];
        },
        // Profile History 관련
        loadProfileHistoryCount: async (profileName, historyName) => {
            throw new Error('Not implemented yet');
        },
        loadProfileHistory: async (profileName, historyName, offset, limit) => {
            const profile = profiles.getProfile(profileName);
            const data = profile.history?.get(historyName, offset, limit);
            return [null, data];
        },
        storeProfileHistory: async (profileName, historyName, data) => {
            const profile = profiles.getProfile(profileName);
            profile.history.append(historyName, data);
            return [null];
        },
        deleteProfileHistory: async (profileName, historyName, id) => {
            const profile = profiles.getProfile(profileName);
            profile.history.delete(historyName, id);
            return [null];
        },
        deleteAllProfileHistory: async (profileName, historyName) => {
            const profile = profiles.getProfile(profileName);
            profile.history.drop(historyName);
            return [null];
        },
        // Last Profile 관련
        setLastProfileName: async (profileName) => {
            profiles.setLastProfileName(profileName);
            return [null];
        },
        getLastProfileName: async () => {
            return [null, profiles.getLastProfileName()];
        },
        // Log 관련
        writeLog: async (name, message, showDatetime) => {
            throw new Error('Not implemented yet');
        }
    };
}

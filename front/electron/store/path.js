const path = require('node:path');

const documentsPath = path.join(process.env.USERPROFILE, 'Documents');
const baseDirectoryPath = path.join(documentsPath, 'AIFront');
const profilesDirectoryPath = path.join(baseDirectoryPath, 'profiles');
const promptsDirectoryPath = path.join(baseDirectoryPath, 'prompts');

const promptPath = {
    getModuleIndex(moduleName) {
        return path.join(promptsDirectoryPath, moduleName, 'index.json');
    },
    getRootIndex() {
        return path.join(promptsDirectoryPath, 'index.json');
    },
    getLegacyRootIndex() {
        return path.join(promptsDirectoryPath, 'list.json');
    },
    get(basePath, targetPath) {
        return path.join(promptsDirectoryPath, basePath, targetPath);
    },
}

module.exports = {
    baseDirectoryPath,
    promptsDirectoryPath,
    profilesDirectoryPath,

    promptPath,
}
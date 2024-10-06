import * as path from 'node:path';

export const documentsPath = path.join(process.env['USERPROFILE']!, 'Documents');
export const baseDirectoryPath = path.join(documentsPath, 'AIFront');
export const profilesDirectoryPath = path.join(baseDirectoryPath, 'profiles');
export const promptsDirectoryPath = path.join(baseDirectoryPath, 'prompts');

export const promptPath = {
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
};
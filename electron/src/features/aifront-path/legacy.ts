import * as path from 'node:path';
import * as fs from 'node:fs';

import {
    baseDirectoryPath,
    profilesDirectoryPath,
} from './path';

const guestProfilePath = path.join(profilesDirectoryPath, 'guest');
const legacyPath = path.join(baseDirectoryPath, 'legacy');

export function migrateLegacyProfile() {
    if (isLegacyProfileDetected() && !fs.existsSync(guestProfilePath)) {
        fs.mkdirSync(guestProfilePath, { recursive: true });

        copyBaseToGuestProfile('config.json', 'config.json');
        copyBaseToGuestProfile('secret.json', 'secret.json');
        copyBaseToGuestProfile('history', 'history');
        copyBaseToGuestProfile('prompts', 'prompts');
    }
}

function isLegacyProfileDetected() {
    const legacyConfigFilePath = path.join(baseDirectoryPath, 'config.json');
    const legacySecretFilePath = path.join(baseDirectoryPath, 'secret.json');
    const legacyHistoryDirectoryPath = path.join(baseDirectoryPath, 'history');
    const legacyPromptsDirectoryPath = path.join(baseDirectoryPath, 'prompts');
    try {
        return (
            isFile(legacyConfigFilePath)
            || isFile(legacySecretFilePath)
            || isDir(legacyHistoryDirectoryPath)
            || isDir(legacyPromptsDirectoryPath)
        );
    }
    catch (e) {
        return false;
    }
}

function isFile(filename) {
    try { return fs.statSync(filename).isFile(); }
    catch (e) { return false; }
}
function isDir(filename) {
    try { return fs.statSync(filename).isFile(); }
    catch (e) { return false; }
}
function copyBaseToGuestProfile(oldFileName, newFileName) {
    const oldPath = path.join(baseDirectoryPath, oldFileName);
    const newPath = path.join(guestProfilePath, newFileName);

    if (fs.existsSync(oldPath)) {
        fs.cpSync(oldPath, newPath, { recursive: true });
    }
}
function moveBaseToLegacyDirectory(filename) {
    const oldPath = path.join(baseDirectoryPath, filename);
    const newPath = path.join(legacyPath, filename);

    if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath);
    }
}
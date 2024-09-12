const path = require('node:path');
const fs = require('node:fs');
const {
    baseDirectoryPath,
    profilesDirectoryPath,
} = require('./path');

const guestProfilePath = path.join(profilesDirectoryPath, 'guest');

function migrateLegacyProfile() {
    if (isLegacyProfileDetected() && !fs.existsSync(guestProfilePath)) {
        fs.mkdirSync(guestProfilePath, { recursive: true });

        copyBaseToGuestProfile('config.json', 'config.json');
        copyBaseToGuestProfile('secret.json', 'secret.json');
        copyBaseToGuestProfile('history', 'history');
    }
}

function isLegacyProfileDetected() {
    const legacyConfigFilePath = path.join(baseDirectoryPath, 'config.json');
    const legacySecretFilePath = path.join(baseDirectoryPath, 'secret.json');
    const legacyHistoryDirectoryPath = path.join(baseDirectoryPath, 'history');
    try {
        return (
            isFile(legacyConfigFilePath)
            || isFile(legacySecretFilePath)
            || isDir(legacyHistoryDirectoryPath)
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

module.exports = {
    migrateLegacyProfile,
}
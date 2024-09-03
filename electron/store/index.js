const { app } = require('electron');
const fs = require('fs');
const path = require('path');

const documentsPath = app.getPath('documents');
const saveFolderPath = path.join(documentsPath, "AIFront");
const historyFolderPath = path.join(saveFolderPath, "history");
const promptFolderPath = path.join(saveFolderPath, "prompts");
const configFilePath = path.join(saveFolderPath, "config.json");
const secretFilePath = path.join(saveFolderPath, "secret.json");

function createBasePath() {
    fs.mkdirSync(saveFolderPath, { recursive: true });
}

function writeConfigData(contents) {
    fs.writeFileSync(configFilePath, JSON.stringify(contents, null, 4), 'utf8');
}
function writeSecretData(contents) {
    fs.writeFileSync(secretFilePath, JSON.stringify(contents, null, 4), 'utf8');
}
function readConfigData() {
    if (fs.existsSync(configFilePath)) {
        const contents = fs.readFileSync(configFilePath, 'utf8');
        try { return JSON.parse(contents); }
        catch {}
    }
    return null;
}
function readSecretData() {
    if (fs.existsSync(secretFilePath)) {
        const contents = fs.readFileSync(secretFilePath, 'utf8');
        try { return JSON.parse(contents); }
        catch {}
    }
    return null;
}
function readPromptContents(pathString) {
    const banPatterns = ["../", "./", "..", "~", "//"];
    for (const pattern of banPatterns) {
        if (pathString.includes(pattern)) {
            return "@FAIL - INVALID PATH";
        }
    }

    const targetPath = path.join(promptFolderPath, pathString);
    if (fs.existsSync(targetPath) && fs.statSync(targetPath).isFile()) {
        return fs.readFileSync(targetPath, 'utf8');
    }
    else {
        return "@FAIL - FILE NOT FOUND";
    }
}
/**
 * @legacy use readPromptMetadata instead
 */
function readPromptList() {
    const targetPath = path.join(promptFolderPath, "list.json");
    return fs.readFileSync(targetPath, 'utf8');
}
function readPromptMetadata(pathString) {
    const banPatterns = ["../", "./", "..", "~", "//"];
    for (const pattern of banPatterns) {
        if (pathString.includes(pattern)) {
            return "@FAIL - INVALID PATH";
        }
    }

    const targetPath = path.join(promptFolderPath, pathString);
    if (fs.existsSync(targetPath) && fs.statSync(targetPath).isFile()) {
        return fs.readFileSync(targetPath, 'utf8');
        //return fs.readFileSync(targetPath, 'utf8');
    }
    else {
        return "@FAIL - FILE NOT FOUND";
    }
}
function readHistory(key) {
    const targetPath = path.join(historyFolderPath, `history${key}.json`);
    if (fs.existsSync(targetPath)) {
        const contents = fs.readFileSync(targetPath, 'utf8');
        try { return JSON.parse(contents); }
        catch {}
    }
    return [];
}
function writeHistory(key, contents) {
    const targetPath = path.join(historyFolderPath, `history${key}.json`);
    fs.writeFileSync(targetPath, JSON.stringify(contents, null, 4), 'utf8');
}

module.exports = {
    createBasePath : createBasePath,
    writeSecretData : writeSecretData,
    readSecretData : readSecretData,
    writeConfigData : writeConfigData,
    readConfigData : readConfigData,
    readHistory : readHistory,
    writeHistory : writeHistory,

    readPromptContents : readPromptContents,
    readPromptList : readPromptList,
    readPromptMetadata : readPromptMetadata,
    promptDirectoryPath : promptFolderPath,
    historyDirectoryPath : historyFolderPath,
}
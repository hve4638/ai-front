import { app } from 'electron';
import fs from 'fs';
import path from 'path';

const documentsPath = app.getPath('documents');
const saveFolderPath = path.join(documentsPath, "AIFront");
const historyFolderPath = path.join(saveFolderPath, "history");
const promptFolderPath = path.join(saveFolderPath, "prompts");
const configFilePath = path.join(saveFolderPath, "config.json");

function readConfigData() {
    if (fs.existsSync(configFilePath)) {
        const contents = fs.readFileSync(configFilePath, 'utf8');
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

export {
    readConfigData,
    readHistory,

    readPromptContents,
    readPromptList,
    readPromptMetadata,
    
    promptFolderPath,
    historyFolderPath,
}
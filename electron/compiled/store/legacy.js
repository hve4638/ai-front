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
exports.migrateLegacyProfile = migrateLegacyProfile;
const path = __importStar(require("node:path"));
const fs = __importStar(require("node:fs"));
const path_1 = require("./path");
const guestProfilePath = path.join(path_1.profilesDirectoryPath, 'guest');
const legacyPath = path.join(path_1.baseDirectoryPath, 'legacy');
function migrateLegacyProfile() {
    if (isLegacyProfileDetected() && !fs.existsSync(guestProfilePath)) {
        fs.mkdirSync(guestProfilePath, { recursive: true });
        copyBaseToGuestProfile('config.json', 'config.json');
        copyBaseToGuestProfile('secret.json', 'secret.json');
        copyBaseToGuestProfile('history', 'history');
        copyBaseToGuestProfile('prompts', 'prompts');
    }
}
function isLegacyProfileDetected() {
    const legacyConfigFilePath = path.join(path_1.baseDirectoryPath, 'config.json');
    const legacySecretFilePath = path.join(path_1.baseDirectoryPath, 'secret.json');
    const legacyHistoryDirectoryPath = path.join(path_1.baseDirectoryPath, 'history');
    const legacyPromptsDirectoryPath = path.join(path_1.baseDirectoryPath, 'prompts');
    try {
        return (isFile(legacyConfigFilePath)
            || isFile(legacySecretFilePath)
            || isDir(legacyHistoryDirectoryPath)
            || isDir(legacyPromptsDirectoryPath));
    }
    catch (e) {
        return false;
    }
}
function isFile(filename) {
    try {
        return fs.statSync(filename).isFile();
    }
    catch (e) {
        return false;
    }
}
function isDir(filename) {
    try {
        return fs.statSync(filename).isFile();
    }
    catch (e) {
        return false;
    }
}
function copyBaseToGuestProfile(oldFileName, newFileName) {
    const oldPath = path.join(path_1.baseDirectoryPath, oldFileName);
    const newPath = path.join(guestProfilePath, newFileName);
    if (fs.existsSync(oldPath)) {
        fs.cpSync(oldPath, newPath, { recursive: true });
    }
}
function moveBaseToLegacyDirectory(filename) {
    const oldPath = path.join(path_1.baseDirectoryPath, filename);
    const newPath = path.join(legacyPath, filename);
    if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath);
    }
}

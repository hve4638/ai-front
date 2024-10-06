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
exports.promptPath = exports.promptsDirectoryPath = exports.profilesDirectoryPath = exports.baseDirectoryPath = exports.documentsPath = void 0;
const path = __importStar(require("node:path"));
exports.documentsPath = path.join(process.env['USERPROFILE'], 'Documents');
exports.baseDirectoryPath = path.join(exports.documentsPath, 'AIFront');
exports.profilesDirectoryPath = path.join(exports.baseDirectoryPath, 'profiles');
exports.promptsDirectoryPath = path.join(exports.baseDirectoryPath, 'prompts');
exports.promptPath = {
    getModuleIndex(moduleName) {
        return path.join(exports.promptsDirectoryPath, moduleName, 'index.json');
    },
    getRootIndex() {
        return path.join(exports.promptsDirectoryPath, 'index.json');
    },
    getLegacyRootIndex() {
        return path.join(exports.promptsDirectoryPath, 'list.json');
    },
    get(basePath, targetPath) {
        return path.join(exports.promptsDirectoryPath, basePath, targetPath);
    },
};

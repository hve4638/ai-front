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
exports.getRootMetadata = getRootMetadata;
exports.getMetadata = getMetadata;
exports.getFileAsString = getFileAsString;
const fs = __importStar(require("node:fs"));
const path_1 = require("./path");
function getRootMetadata() {
    const targetPath = path_1.promptPath.getRootIndex();
    if (fs.existsSync(targetPath)) {
        const data = fs.readFileSync(targetPath, 'utf8');
        return JSON.parse(data);
    }
    else {
        const legacyTargetPath = path_1.promptPath.getLegacyRootIndex();
        const data = fs.readFileSync(legacyTargetPath, 'utf8');
        return JSON.parse(data);
    }
}
function getMetadata(moduleName) {
    const targetPath = path_1.promptPath.getModuleIndex(moduleName);
    const data = fs.readFileSync(targetPath, 'utf8');
    return JSON.parse(data);
}
function getFileAsString(basePath, targetPath) {
    const target = path_1.promptPath.get(basePath, targetPath);
    return fs.readFileSync(target, 'utf8');
}
module.exports = {
    getRootMetadata,
    getMetadata,
    getFileAsString,
};

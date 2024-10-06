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
exports.aiFrontPath = exports.migrateLegacyProfile = exports.prompts = void 0;
exports.createRequiredPath = createRequiredPath;
const fs = __importStar(require("fs"));
exports.prompts = __importStar(require("./prompts"));
const path_1 = require("./path");
var legacy_1 = require("./legacy");
Object.defineProperty(exports, "migrateLegacyProfile", { enumerable: true, get: function () { return legacy_1.migrateLegacyProfile; } });
/** 초기 설정에 필요한 디렉토리 생성 */
function createRequiredPath() {
    const requiredPaths = [
        path_1.baseDirectoryPath,
        path_1.promptsDirectoryPath,
        path_1.profilesDirectoryPath
    ];
    for (const requiredPath of requiredPaths) {
        fs.mkdirSync(requiredPath, { recursive: true });
    }
}
exports.aiFrontPath = {
    baseDirectoryPath: path_1.baseDirectoryPath,
    promptsDirectoryPath: path_1.promptsDirectoryPath,
    profilesDirectoryPath: path_1.profilesDirectoryPath,
};

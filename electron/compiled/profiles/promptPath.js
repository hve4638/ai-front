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
const path = __importStar(require("node:path"));
/**
 * Profile 내 Prompt 파일 경로 관리
 */
class PromptPath {
    #promptsPath;
    constructor(profileDirectoryPath) {
        this.#promptsPath = path.join(profileDirectoryPath, 'prompts');
    }
    /** Root PromptMetatada 반환 */
    get rootMetadata() {
        return path.join(this.#promptsPath, 'index.json');
    }
    /** 레거시 Root PromptMetadata(list.json) 반환 */
    get legacyRootMetadata() {
        return path.join(this.#promptsPath, 'list.json');
    }
    /** 모듈의 PromptMetadata 경로 반환 */
    getModuleMetadata(moduleName) {
        return path.join(this.#promptsPath, moduleName, 'index.json');
    }
    /** 모듈의 파일 반환 */
    getFile(moduleName, fileName) {
        return path.join(this.#promptsPath, moduleName, fileName);
    }
}
exports.default = PromptPath;

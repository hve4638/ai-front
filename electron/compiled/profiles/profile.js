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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("node:fs"));
const path = __importStar(require("node:path"));
const history_1 = __importDefault(require("./history"));
const JsonStorage_1 = __importDefault(require("./JsonStorage"));
const promptPath_1 = __importDefault(require("./promptPath"));
const errors_1 = require("./errors");
/**
 * 특정 Profile의 History, Store, Prompt 등을 관리
 */
class Profile {
    /** Profile 디렉토리 경로 */
    #profilePath;
    #promptPath;
    #history;
    #profileStores = {};
    constructor(profilePath) {
        this.#profilePath = profilePath;
        this.#promptPath = new promptPath_1.default(profilePath);
        this.#history = new history_1.default(path.join(profilePath, 'history'));
    }
    get history() {
        if (this.#history) {
            return this.#history;
        }
        else {
            throw new errors_1.ProfileError('HistoryManger is closed.');
        }
    }
    setValue(storeName, key, value) {
        this.#loadStoreFile(storeName);
        this.#profileStores[storeName].set(key, value);
    }
    getValue(storeName, key) {
        this.#loadStoreFile(storeName);
        return this.#profileStores[storeName].get(key);
    }
    getRootPromptMetadata() {
        try {
            const targetPath = this.#promptPath.rootMetadata;
            if (fs.existsSync(targetPath)) {
                const data = fs.readFileSync(targetPath, 'utf8');
                return JSON.parse(data);
            }
            else {
                const legacyTargetPath = this.#promptPath.legacyRootMetadata;
                const data = fs.readFileSync(legacyTargetPath, 'utf8');
                return JSON.parse(data);
            }
        }
        catch (e) {
            throw new errors_1.ProfileError('Failed to get root prompt metadata');
        }
    }
    getModulePromptMetdata(moduleName) {
        const targetPath = this.#promptPath.getModuleMetadata(moduleName);
        const data = fs.readFileSync(targetPath, 'utf8');
        return JSON.parse(data);
    }
    getPromptTemplate(moduleName, filename) {
        const target = this.#promptPath.getFile(moduleName, filename);
        return fs.readFileSync(target, 'utf8');
    }
    /** ProfileStore를 열기 */
    #loadStoreFile(storeFileName) {
        if (!(storeFileName in this.#profileStores)) {
            const filePath = path.join(this.#profilePath, storeFileName);
            const file = new JsonStorage_1.default(filePath);
            file.readFile();
            this.#profileStores[storeFileName] = file;
        }
        return this.#profileStores[storeFileName];
    }
    save() {
        for (const filename in this.#profileStores) {
            this.#profileStores[filename].writeFile();
        }
    }
    close() {
        this.#history?.close();
        this.#history = null;
    }
}
exports.default = Profile;

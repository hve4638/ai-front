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
const path = __importStar(require("node:path"));
const fs = __importStar(require("node:fs"));
const betterSQLite3History_1 = __importDefault(require("./betterSQLite3History"));
class HistoryManager {
    #databases;
    #basePath;
    constructor(directoryPath) {
        this.#basePath = directoryPath;
        this.#databases = {};
        fs.mkdirSync(this.#basePath, { recursive: true });
    }
    /**
     * 히스토리 DB 파일 경로를 반환
     * @param {string} key
     * @returns {string}
     */
    #getPath(key) {
        return path.join(this.#basePath, `history${key}`);
    }
    #openDBIfExists(key) {
        const target = this.#getPath(key);
        let db;
        if (key in this.#databases) {
            return this.#databases[key];
        }
        else if (fs.existsSync(target)) {
            const target = this.#getPath(key);
            db = new betterSQLite3History_1.default(target);
            this.#databases[key] = db;
            return db;
        }
        else {
            return null;
        }
    }
    /**
     * @returns {Database}
     */
    #openDB(key) {
        let db;
        if (key in this.#databases) {
            db = this.#databases[key];
        }
        else {
            const target = this.#getPath(key);
            db = new betterSQLite3History_1.default(target);
            this.#databases[key] = db;
        }
        return db;
    }
    /**
     * offset 부터 limit 만큼의 데이터를 내림차순 반환
     * @param {*} key
     * @param {*} offset
     * @param {*} limit
     * @returns
     */
    get(key, offset = 0, limit = 1000) {
        const db = this.#openDB(key);
        return db.get(offset, limit);
    }
    append(key, data) {
        const db = this.#openDB(key);
        db.append(JSON.stringify(data));
    }
    delete(key, id) {
        const db = this.#openDB(key);
        db.delete(id);
    }
    drop(key) {
        const db = this.#openDBIfExists(key);
        if (db) {
            db.drop();
            delete this.#databases[key];
        }
    }
    close() {
        for (const key in this.#databases) {
            const db = this.#databases[key];
            db.close();
        }
        this.#databases = {};
    }
}
exports.default = HistoryManager;

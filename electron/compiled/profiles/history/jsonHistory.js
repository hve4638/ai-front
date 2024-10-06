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
const fs = __importStar(require("node:fs"));
class JsonHistory {
    #path;
    #contents;
    #closed;
    constructor(path) {
        this.#closed = false;
        this.#path = path;
        this.#contents = this.#read() ?? [];
    }
    #read() {
        if (fs.existsSync(this.#path)) {
            const contents = fs.readFileSync(this.#path, 'utf8');
            try {
                return JSON.parse(contents);
            }
            catch {
                return null;
            }
        }
        else {
            return null;
        }
    }
    #write() {
        if (!this.#closed) {
            fs.writeFileSync(this.#path, JSON.stringify(this.#contents, null, 4), 'utf8');
        }
    }
    close() {
        if (!this.#closed) {
            this.#write();
            this.#closed = true;
        }
    }
    get(offset = 0, limit = 1000) {
        function slice(arr, n, m) {
            let beginIndex = n >= 0 ? n : Math.max(0, arr.length + n);
            let endIndex = m > 0 ? m : Math.max(0, arr.length + m);
            return arr.slice(beginIndex, endIndex);
        }
        return slice(this.#contents, -offset * limit - limit, offset * limit);
    }
    append(data) {
        this.#contents.push({
            id: this.#contents.length,
            data: data
        });
    }
    drop() {
        this.#closed = true;
        this.#contents = [];
        if (fs.existsSync(this.#path)) {
            fs.unlinkSync(this.#path);
        }
    }
}
module.exports = JsonHistory;

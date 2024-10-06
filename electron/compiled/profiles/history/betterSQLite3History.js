"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const node_fs_1 = __importDefault(require("node:fs"));
class BetterSQLite3History {
    #path;
    #db;
    constructor(path) {
        this.#path = path;
        try {
            this.#db = new better_sqlite3_1.default(path);
        }
        catch (e) {
            throw new Error(`Failed to open database '${path}' : ${e.message}`);
        }
        this.#db.exec(`CREATE TABLE IF NOT EXISTS history (
            id INTEGER PRIMARY KEY,
            data TEXT
        )`);
    }
    close() {
        if (this.#db) {
            this.#db.close();
            this.#db = null;
        }
    }
    get(offset = 0, limit = 1000) {
        const select = this.#db.prepare("SELECT * FROM history ORDER BY id DESC LIMIT $limit OFFSET $offset");
        return select.all({ offset, limit });
    }
    append(data) {
        const insert = this.#db.prepare("INSERT INTO history(data) VALUES($data)");
        insert.run({ data });
    }
    delete(id) {
        const query = this.#db.prepare("DELETE FROM history WHERE id = $id");
        query.run({ id });
    }
    drop() {
        const query = this.#db.prepare("DELETE FROM history");
        query.run();
        this.#db.close();
        if (node_fs_1.default.existsSync(this.#path)) {
            node_fs_1.default.unlinkSync(this.#path);
        }
    }
}
exports.default = BetterSQLite3History;

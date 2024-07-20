const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

class BetterSQLite3History {
    #path;
    #db;

    constructor(path) {
        this.#path = path;
        this.#db = new Database(path);
            
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

    get(offset=0, limit=1000) {
        const select = this.#db.prepare(
            "SELECT * FROM history ORDER BY id DESC LIMIT $limit OFFSET $offset"
        );
        return select.all({offset, limit});
    }

    append(data) {
        const insert = this.#db.prepare(
            "INSERT INTO history(data) VALUES($data)"
        );
        insert.run({data});
    }

    drop() {
        this.#db.close();

        if (fs.existsSync(this.#path)) {
            fs.unlinkSync(this.#path);
        }
    }
}

module.exports = BetterSQLite3History;
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

class BetterSQLite3History {
    #path;
    #db;

    constructor(path) {
        this.#path = path;
        try {
            this.#db = new Database(path);
        }
        catch(e) {
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
    
    delete(id) {
        const query = this.#db.prepare(
            "DELETE FROM history WHERE id = $id"
        );
        query.run({id});
    }

    drop() {
        const query = this.#db.prepare(
            "DELETE FROM history"
        );
        query.run();
        this.#db.close();

        if (fs.existsSync(this.#path)) {
            fs.unlinkSync(this.#path);
        }
    }
}

module.exports = BetterSQLite3History;
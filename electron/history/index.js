const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

class HistoryManager {
    #databases;
    #basePath;

    constructor(directoryPath) {
        this.#basePath = directoryPath;
        this.#databases = {};
    }
    
    #getDB(key) {
        let db;
        if (key in this.#databases) {
            db = this.#databases[key];
        }
        else {
            const target = path.join(this.#basePath, `history${key}`);
            db = new Database(target);
            this.#databases[key] = db;
            
            db.exec(`CREATE TABLE IF NOT EXISTS history (
                id INTEGER PRIMARY KEY,
                data TEXT
            )`);
        }
        
        return db;
    }

    async select(key, offset=0, limit=1000) {
        const db = this.#getDB(key);
        const select = db.prepare(
            "SELECT * FROM history ORDER BY id DESC LIMIT $limit OFFSET $offset"
        );
        return select.all({offset, limit});
    }

    insert(key, data) {
        const db = this.#getDB(key);
        const insert = db.prepare(
            "INSERT INTO history(data) VALUES($data)"
        );
        insert.run({data:JSON.stringify(data)});
    }

    async dropAll(key) {
        const target = path.join(this.#basePath, `history${key}`);
        const removeFile = (target) => {
            fs.unlinkSync(target);
        }
        
        if (key in this.#databases) {
            let db = this.#databases[key]
            delete this.#databases[key];

            try {
                db.close();
                removeFile(target);
            }
            catch(error) {
                console.log(error);
                return;
            }
        }
        else if (fs.existsSync(target)) {
            removeFile(target);
        }
    }


    close() {
        
    }
}


module.exports = {
    HistoryManager : HistoryManager,
}
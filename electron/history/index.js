const sqlite3 = require('sqlite3').verbose();
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
            db = new sqlite3.Database(target);
            this.#databases[key] = db;
            
            let query = `CREATE TABLE IF NOT EXISTS history (
                id INTEGER PRIMARY KEY,
                data TEXT
            );`
            db.serialize(() => {
                db.run(query, (err) => {
                    if (err) {
                        console.error("Error creating table:", err.message);
                    }
                });
            });
        }
        
        return db;
    }

    async select(key, offset=0, limit=1000) {
        const db = this.#getDB(key);
        let query = `SELECT * FROM history ORDER BY id DESC LIMIT ? OFFSET ?`
        
        return new Promise((resolve, reject)=>{
            db.all(query, [limit, offset], (err, rows)=>{
                if (err) {
                    console.error(`error: ${err}`);
                }
                else {
                    resolve(rows);
                }
            })
        })
    }

    async insert(key, data) {
        const db = this.#getDB(key);
        let query = `INSERT INTO history(data) VALUES(?)`
        
        db.run(query, [JSON.stringify(data)]);
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
                db.close((err)=>{
                    removeFile(target);
                });
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
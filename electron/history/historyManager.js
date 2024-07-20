const Database = require('./betterSQLite3History');
//const Database = require('./jsonHistory');
const path = require('path');
const fs = require('fs');

class HistoryManager {
    #databases;
    #basePath;

    constructor(directoryPath) {
        this.#basePath = directoryPath;
        this.#databases = {};
        
        fs.mkdirSync(this.#basePath, { recursive: true });
    }

    #getPath(key) {
        return path.join(this.#basePath, `history${key}`);
    }
    
    #openDBIfExists(key) {
        const target = this.#getPath(key);

        let db;
        if (key in this.#databases) {
            db = this.#databases[key];
        }
        else if (fs.existsSync(target)) {
            const target = this.#getPath(key);
            db = new Database(target);
            this.#databases[key] = db;
            return db;
        }
        else {
            return null;
        }
    }

    #openDB(key) {
        let db;
        if (key in this.#databases) {
            db = this.#databases[key];
        }
        else {
            const target = this.#getPath(key);
            db = new Database(target);
            this.#databases[key] = db;
        }
        
        return db;
    }

    get(key, offset=0, limit=1000) {
        const db = this.#openDB(key);

        return db.get(offset, limit);
    }

    append(key, data) {
        const db = this.#openDB(key);

        db.append(JSON.stringify(data));
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


module.exports = HistoryManager;
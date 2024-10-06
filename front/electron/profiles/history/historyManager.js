const Database = require('./betterSQLite3History');
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
            db = new Database(target);
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
            db = new Database(target);
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
    get(key, offset=0, limit=1000) {
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

module.exports = HistoryManager;
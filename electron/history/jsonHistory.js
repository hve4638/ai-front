const path = require('path');
const fs = require('fs');

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
            try { return JSON.parse(contents); }
            catch { return null; }
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

    get(offset=0, limit=1000) {
        function slice(arr, n, m) {
            let beginIndex = n >= 0 ? n : Math.max(0, arr.length + n);
            let endIndex = m > 0 ? m : Math.max(0, arr.length + m);
            return arr.slice(beginIndex, endIndex);
        }
        
        return slice(this.#contents, -offset*limit-limit, offset*limit);
    }

    append(data) {
        this.#contents.push({
            id : this.#contents.length,
            data : data
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
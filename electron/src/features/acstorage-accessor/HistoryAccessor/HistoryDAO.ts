import Database from 'better-sqlite3';
import fs from 'node:fs';

type HistoryRow = {
    id:number;
    chat_type:string;
    input:string;
    output:string;
    data:string;
}

class HistoryDAO {
    #path:string|null;
    #db:Database;

    constructor(path:string|null) {
        this.#path = path;
        try {
            this.#db = new Database(path ?? ':memory:');
        }
        catch(e:any) {
            throw new Error(`Failed to open database '${path}' : ${e.message}`);
        }
        
        this.#db.exec(`CREATE TABLE IF NOT EXISTS history (
            id INTEGER PRIMARY KEY,
            chat_type TEXT,
            input TEXT,
            output TEXT,
            data TEXT
        )`);
    }

    close() {
        if (this.#db) {
            this.#db.close();
            this.#db = null;
        }
    }

    select(offset=0, limit=1000) {
        const select = this.#db.prepare(
            "SELECT * FROM history ORDER BY id DESC LIMIT $limit OFFSET $offset"
        );
        return select.all({offset, limit});
    }

    insert(chatType:string, input:string, output:string, data:string) {
        const insert = this.#db.prepare(
            "INSERT INTO history(chat_type, input, output, data) VALUES($chatType, $input, $output, $data)"
        );
        insert.run({ chatType, input, output, data });
    }
    
    delete(id:number) {
        const query = this.#db.prepare(
            "DELETE FROM history WHERE id = $id"
        );
        query.run({id});
    }

    search(input:string='', output:string='') {
        if (input.length !== 0 && output.length !== 0) {
            const query = this.#db.prepare(
                "SELECT * FROM history WHERE input LIKE $input OR output LIKE $output ORDER BY id DESC"
            );
            return query.all({input, output});
        }
        else if (input.length !== 0) {
            const query = this.#db.prepare(
                "SELECT * FROM history WHERE input LIKE $input ORDER BY id DESC"
            );
            return query.all({input});
        }
        else if (output.length !== 0) {
            const query = this.#db.prepare(
                "SELECT * FROM history WHERE output LIKE $output ORDER BY id DESC"
            );
            return query.all({output});
        }
        else {
            return this.select();
        }
    }

    deleteAll() {
        const query = this.#db.prepare(
            "DELETE FROM history"
        );
        query.run();
        this.#db.close();

        if (this.#path && fs.existsSync(this.#path)) {
            fs.unlinkSync(this.#path);
        }
    }
    drop() {
        this.#db.close();

        if (this.#path && fs.existsSync(this.#path)) {
            fs.unlinkSync(this.#path);
        }
    }

    commit() {
        this.#db.commit();
    }
}

export default HistoryDAO;
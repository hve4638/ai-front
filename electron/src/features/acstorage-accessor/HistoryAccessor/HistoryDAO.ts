import Database, { Database as DB } from 'better-sqlite3';
import fs from 'node:fs';
import { HistoryRow, MessageRow } from './types';

export type HistorySearchRow = {
    text : string;
    search_type : 'input' | 'output' | 'both';
    date: number|null;
    regex : boolean;
    
    offset: number;
    limit: number;
}

type HistoryRowInput = {
    chat_type: 'chat' | 'normal';
    input_token_count: number | null;
    output_token_count: number | null;
    raw_response: string;
    rt_id: string;
    rt_uuid: string;
    model_id: string;
    create_at: number;
    fetch_count: number;
}

type MessageRowInput = {
    type: 'text' | 'image_url' | 'file';
    origin: 'in' | 'out';
    text: string | null;
    data: string | null;
    token_count: number | null;
}

class HistoryDAO {
    #path: string | null;
    #db: DB;

    constructor(path: string | null) {
        this.#path = path;
        this.#db = this.initDB(path);
    }

    initDB(path: string | null): DB {
        let db: DB;
        try {
            db = new Database(path ?? ':memory:');
        }
        catch (e: any) {
            throw new Error(`Failed to open database '${path}' : ${e.message}`);
        }

        db.exec(`CREATE TABLE IF NOT EXISTS history (
            id INTEGER PRIMARY KEY,
            chat_type TEXT CHECK(chat_type IN ('chat', 'normal')),

            input_token_count INTEGER DEFAULT 0,
            output_token_count INTEGER DEFAULT 0,

            raw_response TEXT NOT NULL,

            rt_id TEXT NOT NULL,
            rt_uuid TEXT NOT NULL,
            model_id TEXT NOT NULL,

            fetch_count INTEGER DEFAULT 0,
            create_at INTEGER NOT NULL
        )`);
        db.exec(`CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY,
            history_id INTEGER,
            message_index INTEGER NOT NULL,
            message_type TEXT CHECK(message_type IN ('text', 'image_url', 'file')),

            origin TEXT CHECK(origin IN ('in', 'out')),

            text TEXT,
            data TEXT,

            token_count INTEGER NOT NULL,
            FOREIGN KEY (history_id) REFERENCES history(id) ON DELETE CASCADE
        )`);
        db.pragma('foreign_keys = ON');

        db.exec(`CREATE INDEX IF NOT EXISTS idx_history_create_at ON history (create_at)`);
        db.exec(`CREATE INDEX IF NOT EXISTS idx_messages_history_id_message_index ON messages (history_id, message_index)`);

        db.function('regexp', { deterministic: true }, (pattern: string, value) => {
            return new RegExp(pattern).test(value) ? 1 : 0;
        })

        return db;
    }

    close() {
        if (this.#db) {
            this.#db.close();
            this.#db = null as any as DB;
        }
    }

    insertHistory(row: HistoryRowInput): number {
        const insert = this.#db.prepare(
            `
                INSERT INTO history(
                    chat_type,
                    input_token_count,
                    output_token_count,
                    raw_response,
                    rt_id,
                    rt_uuid,
                    model_id,
                    create_at,
                    fetch_count
                ) VALUES (
                    $chat_type,
                    $input_token_count,
                    $output_token_count,
                    $raw_response,
                    $rt_id,
                    $rt_uuid,
                    $model_id,
                    $create_at,
                    $fetch_count
                )
            `
        );

        const { lastInsertRowid } = insert.run(row);
        return lastInsertRowid as number;
    }

    insertMessage(historyId: number, row: MessageRowInput) {
        const insert = this.#db.prepare(
            `INSERT INTO messages (
                history_id,
                message_index,
                message_type,
                origin,
                text,
                data,
                token_count
            )
            SELECT 
                $history_id,
                COUNT(*),
                $type,
                $origin,
                $text,
                $data,
                $token_count
            FROM messages
            WHERE history_id = $history_id
            `
        );
        insert.run({ history_id: historyId, ...row });
    }

    selectHistory(offset = 0, limit = 1000) {
        const query = this.#db.prepare(
            `SELECT *
            FROM history
            ORDER BY create_at DESC
            LIMIT $limit
            OFFSET $offset`
        );
        return query.all({ offset, limit }) as HistoryRow[];
    }

    selectMessages(historyId:number|bigint) {
        const query = this.#db.prepare(
            `SELECT *
            FROM messages
            WHERE history_id = $historyId
            ORDER BY message_index ASC`
        );
        return query.all({ historyId }) as MessageRow[];
    }

    searchHistory(search:HistorySearchRow) {
        const params:Record<string, unknown> = {};
        const likeQuery:string[] = [];
        if (search.text != null && search.text.length > 0) {
            const texts = search.text.split(' ').map((text) => `%${text}%`);

            if (search.regex) {
                for (const text of texts) {

                }
            }
            else {
                for (const index in texts) {
                    const text = texts[index];
                    const key = `text_${index}`;
                    params[key] = text;

                    if (search.search_type === 'input') {
                        likeQuery.push(`input_keywords LIKE $${key}`);
                    } else if (search.search_type === 'output') {
                        likeQuery.push(`output_keywords LIKE $${key}`);
                    } else if (search.search_type === 'both') {
                        likeQuery.push(`input_keywords LIKE $${key} OR output_keywords LIKE $${key}`);
                    }
                }
            }
        }
        const dateQuery:string[] = [];
        if (search.date != null) {
            params['date'] = search.date;
            dateQuery.push(`create_at >= $date`);
        }

        let like:string|undefined = '';
        let date:string|undefined;
        if (likeQuery.length) {
            like = likeQuery.join(' OR ');
        }
        if (dateQuery.length) {
            date = dateQuery.join(' AND ');
        }
        
        let where:string;
        if (like && date) {
            where = `WHERE (${like}) AND (${date})`;
        } else if (like) {
            where = `WHERE ${like}`;
        } else if (date) {
            where = `WHERE ${date}`;
        } else {
            where = '';
        }

        const query = this.#db.prepare(
            `SELECT *
            FROM history
            ${where}
            ORDER BY create_at DESC
            LIMIT $limit
            OFFSET $offset`
        );
        return query.run({ ...params, offset: search.offset, limit: search.limit });
    }

    delete(historyId: number) {
        const query = this.#db.prepare(
            "DELETE FROM history WHERE id = $id"
        );
        query.run({ id: historyId });
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
}

export default HistoryDAO;
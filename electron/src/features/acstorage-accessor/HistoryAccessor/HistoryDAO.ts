import Database, { Database as DB } from 'better-sqlite3';
import fs from 'node:fs';
import { HistoryRow, MessageRow } from './types';

export type HistorySearchRow = {
    text: string;
    search_scope: 'input' | 'output' | 'any';
    // date?: number;
    regex: boolean;

    offset: number;
    limit: number;
}

type HistoryRowInput = {
    chat_type: 'chat' | 'normal';
    input_token_count: number | null;
    output_token_count: number | null;
    form: string;
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

        /**
         * history 테이블
         * id : 고유 키
         * chat_type : 채팅 타입 (chat, normal)
         * branch_id : 브랜치 ID (0은 기본 브랜치)
         * input_token_count : 입력 토큰 수
         * output_token_count : 출력 토큰 수
         * form : 폼 정보 (JSON 문자열)
         * rt_id : 요청 타입 ID
         * rt_uuid : 요청 타입 UUID
         * model_id : 모델 ID
         * fetch_count : ?
         * create_at : 생성 시간 (UNIX 타임스탬프)
         * is_complete : 완료 여부
         */
        db.exec(`CREATE TABLE IF NOT EXISTS history (
            id INTEGER PRIMARY KEY,
            chat_type TEXT CHECK(chat_type IN ('chat', 'normal')),

            branch_id INTEGER DEFAULT 0,

            input_token_count INTEGER DEFAULT 0,
            output_token_count INTEGER DEFAULT 0,

            form TEXT DEFAULT '{}',

            rt_id TEXT NOT NULL,
            rt_uuid TEXT NOT NULL,
            model_id TEXT NOT NULL,

            fetch_count INTEGER DEFAULT 0,
            create_at INTEGER NOT NULL,

            is_complete INTEGER DEFAULT 0
        )`);
        /**
         * messages 테이블
         * id : 고유 키
         * history_id : history 테이블의 ID (외래 키)
         * message_index : 메시지 인덱스
         * origin : 입력/출력 구분 (in, out)
         * 
         * message_type : 메시지 타입 (text, image_url, file)
         * text : 메시지 텍스트
         * data : 메시지 데이터
         * 
         * token_count : 토큰 수
         */
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

    insertHistory(row: {
        form: string;
        rt_id: string;
        rt_uuid: string;
        model_id: string;
        create_at: number;
    }): number {
        const insert = this.#db.prepare(
            `
                INSERT INTO history(
                    form,
                    rt_id,
                    rt_uuid,
                    model_id,
                    create_at,
                    is_complete
                ) VALUES (
                    $form,
                    $rt_id,
                    $rt_uuid,
                    $model_id,
                    $create_at,
                    0
                )
            `
        );

        const { lastInsertRowid } = insert.run(row);
        return lastInsertRowid as number;
    }

    updateHistory(historyId: number, row: Partial<HistoryRowInput>) {
        if (Object.keys(row).length === 0) return;

        const sets = Object.keys(row).map(k => `${k} = $${k}`).join(', ');
        const update = this.#db.prepare(
            `UPDATE history
            SET
                ${sets}
            WHERE id = $id`
        );
        update.run({ id: historyId, ...row });
    }

    completeHistory(historyId: number) {
        const update = this.#db.prepare(
            `UPDATE history
            SET 
                is_complete = 1
            WHERE id = $id`
        );
        update.run({ id: historyId });
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

    selectHistory({ offset = 0, limit = 1000, desc = true, branchId }: {
        offset?: number;
        limit?: number;
        desc?: boolean;
        branchId?: number;
    }) {
        const query = this.#db.prepare(
            `SELECT *
            FROM history
            ORDER BY create_at ${desc ? 'DESC' : 'ASC'}
            LIMIT $limit
            OFFSET $offset`
        );
        return query.all({ offset, limit }) as HistoryRow[];
    }

    selectMessages(historyId: number | bigint) {
        const query = this.#db.prepare(
            `SELECT *
            FROM messages
            WHERE history_id = $historyId
            ORDER BY message_index ASC`
        );
        return query.all({ historyId }) as MessageRow[];
    }

    searchHistory(search: HistorySearchRow) {
        const params: Record<string, unknown> = {};
        const likeQuery: string[] = [];
        if (search.text == null || search.text.trim().length === 0) {
            return this.selectHistory({
                offset: search.offset,
                limit: search.limit,
                desc: true,
            });
        }

        const texts = search.text.split(' ').map((text) => `%${text}%`);
        if (search.regex) {
            throw new Error('Not implemented');
        }
        else {
            for (const index in texts) {
                const key = `text_${index}`;
                const value = texts[index];

                params[key] = value;

                likeQuery.push(`messages.text LIKE $${key}`);
            }
        }

        let where: string = '';
        if (likeQuery.length !== 0) {
            const like = likeQuery.join(' OR ');

            if (search.search_scope === 'input') {
                where = `WHERE messages.origin = 'in' AND (${like})`;
            }
            else if (search.search_scope === 'output') {
                where = `WHERE messages.origin = 'out' AND (${like})`;
            }
            else {
                where = `WHERE ${like}`;
            }
        }

        const query = this.#db.prepare(
            `
            SELECT DISTINCT history.*
            FROM history
            JOIN messages
            ON history.id = messages.history_id
            ${where}
            LIMIT $limit
            OFFSET $offset`
        );
        return query.all({ ...params, offset: search.offset, limit: search.limit }) as HistoryRow[];
    }

    selectMessageOrigin(historyId: number) {
        const query = this.#db.prepare(
            `
            SELECT DISTINCT origin
            FROM messages
            WHERE history_id = $historyId
            `
        );
        return query.all({ historyId }) as { origin: 'in' | 'out' }[];
    }

    deleteMessages(historyId: number, origin: 'in' | 'out' | 'both' = 'both') {
        if (origin === 'both') {
            const query = this.#db.prepare(
                `
                DELETE FROM messages
                WHERE history_id = $historyId
                `
            );
            query.run({ historyId });
        }
        else {
            const query = this.#db.prepare(
                `
                DELETE FROM messages
                WHERE history_id = $historyId
                AND origin = $origin
                `
            );
            query.run({ historyId, origin });
        }
    }
    
    delete(historyId: number) {
        const query = this.#db.prepare(
            'DELETE FROM history WHERE id = $id'
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
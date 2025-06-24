import Database, { Database as DB } from 'better-sqlite3';
import { HISTORY_VERSION, MESSAGES_VERSION } from './data';
import runtime from '@/runtime';

class HistoryMigrationManager {
    #db: DB;

    constructor(db: DB) {
        this.#db = db;
    }

    public migrate(): void {
        this.ensureVersionTable();

        const query = this.#db.prepare(
            `SELECT version
            FROM version
            WHERE name = $name`
        );
        const row = query.get({ name: 'messages' }) as { version: number } | undefined;

        let version: number = 0;
        if (row) version = row.version;
        else version = 0;

        if (version < MESSAGES_VERSION) {
            switch (version) {
                case 0:
                    this.migrateMessages0to1();
                    break;
                default:
                    throw new Error(`Unsupported messages version: ${version}`);
            }
        }
        else {
            console.log('No migration needed for messages table.');
        }
    }

    private ensureVersionTable(): void {
        this.#db.exec(`
            CREATE TABLE IF NOT EXISTS version (
                name TEXT,
                version INTEGER
            )
        `);
    }

    private migrateMessages0to1(): void{
        runtime.logger.info('Migrating historyDB(messages) (v0 to v1)');
        this.#db.transaction(() => {
            this.#db.exec(`
                ALTER TABLE messages RENAME TO messages_old;
            `);

            this.#db.exec(`
                CREATE TABLE messages (
                    id INTEGER PRIMARY KEY,
                    history_id INTEGER,
                    message_index INTEGER NOT NULL,
                    message_type TEXT CHECK(message_type IN ('text', 'image_url', 'image_base64', 'file_url', 'file_base64')),

                    origin TEXT CHECK(origin IN ('in', 'out')),

                    text TEXT,
                    data TEXT,
                    data_name TEXT,
                    data_type TEXT,
                    data_thumbnail TEXT,

                    token_count INTEGER NOT NULL,
                    FOREIGN KEY (history_id) REFERENCES history(id) ON DELETE CASCADE
                )
            `);

            this.#db.exec(`
                INSERT INTO messages (
                    id, history_id, message_index, message_type,
                    origin, text, data, token_count
                )
                SELECT
                    id, history_id, message_index, message_type,
                    origin, text, data, token_count
                FROM messages_old;
            `);

            // 4. 기존 테이블 삭제
            this.#db.exec(`
                DROP TABLE messages_old
            `);

            // 5. 버전 테이블 갱신
            this.#db.prepare(`
                DELETE FROM version WHERE name = 'messages'
            `).run();
            this.#db.prepare(`
                INSERT INTO version (name, version) VALUES (?, ?)
            `).run('messages', 1);
        })();
        runtime.logger.info('Successfully migrated historyDB(messages) to v1');
    }
}

export default HistoryMigrationManager;

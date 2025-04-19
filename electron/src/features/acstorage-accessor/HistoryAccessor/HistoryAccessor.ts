import { ICustomAccessor } from 'ac-storage';
import HistoryDAO from './HistoryDAO';
import { type HistorySearchRow } from './HistoryDAO';
import { HistoryRequired } from './types';

class HistoryAccessor implements ICustomAccessor {
    #dao:HistoryDAO;
    #droped:boolean = false;

    constructor(target:string|null) {
        this.#dao = new HistoryDAO(target);
    }

    addHistory(historyRequired:Required<HistoryRequired>) {
        const {
            chat_type,
            input_token_count, output_token_count,
            rt_id, rt_uuid, model_id,
            fetch_count, create_at,
            raw_response,
            input, output,
        } = historyRequired;

        const historyId = this.#dao.insertHistory({
            chat_type,
            input_token_count, output_token_count,
            rt_id, rt_uuid, model_id,
            fetch_count, create_at,
            raw_response: JSON.stringify(raw_response),
        });
        for (const message of input) {
            if (!message.text) continue;

            this.#dao.insertMessage(historyId, {
                origin: 'in',
                type : message.type,
                text : message.text,
                data: message.data,
                
                token_count: message.token_count,
            });
        }
        for (const message of output) {
            if (!message.text) continue;

            this.#dao.insertMessage(historyId, {
                origin: 'out',
                type : message.type,
                text : message.text,
                data: message.data,
                token_count: message.token_count,
            });
        }
    }

    getHistory(offset=0, limit=1000) {
        const history = this.#dao.selectHistory(offset, limit);

        return history;
    }

    searchHistory(search:HistorySearchRow) {
        return this.#dao.searchHistory(search);
    }

    getMessageText(historyId:number):{input:string, output:string} {
        const messages = this.#dao.selectMessages(historyId);

        const inputText:string[] = [];
        const outputText:string[] = [];

        for (const message of messages) {
            if (message.origin === 'in') {
                if (message.text) inputText.push(message.text);
            }
            else if (message.origin === 'out') {
                if (message.text) outputText.push(message.text);
            }
        }

        return {
            input : inputText.join(' '),
            output : outputText.join(' '),
        };
    }

    delete(id:number) {
        this.#dao.delete(id);
    }

    deleteAll() {
        this.#dao.deleteAll();
    }

    drop() {
        if (this.#droped) return;
        this.#droped = true;

        this.#dao.drop();
    }

    isDropped() {
        return this.#droped;
    }

    commit() {
        
    }
}

export default HistoryAccessor;
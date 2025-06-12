import { ICustomAccessor } from 'ac-storage';
import HistoryDAO from './HistoryDAO';
import { type HistorySearchRow } from './HistoryDAO';
import { HistoryMessageRow, HistoryRequired } from './types';

class HistoryAccessor implements ICustomAccessor {
    #dao:HistoryDAO;
    #droped:boolean = false;

    constructor(target:string|null) {
        this.#dao = new HistoryDAO(target);
    }

    addHistory(historyRequired:{
        rt_id : string;
        rt_uuid : string;
        model_id : string;

        form : Record<string, unknown>;
        
        create_at : number;
    }):number {
        const {
            rt_id, rt_uuid, model_id,
            create_at,
            form,
        } = historyRequired;

        const historyId = this.#dao.insertHistory({
            rt_id, rt_uuid, model_id,
            create_at,
            form: JSON.stringify(form),
        });

        return historyId;
    }

    updateHistory(historyId:number, historyRequired:Partial<HistoryRequired>) {
        this.#dao.updateHistory(historyId, {
            input_token_count: historyRequired.input_token_count,
            output_token_count: historyRequired.output_token_count,
            rt_id: historyRequired.rt_id,
            rt_uuid: historyRequired.rt_uuid,
            model_id: historyRequired.model_id,
            fetch_count: historyRequired.fetch_count,
            create_at: historyRequired.create_at,
            form: JSON.stringify(historyRequired.form),
        }); 
    }

    addHistoryMessage(historyId:number, origin:'in'|'out', messages:HistoryMessageRow[]) {
        for (const m of messages) {
            if (!m.text) continue;

            this.#dao.insertMessage(historyId, {
                origin: origin,
                ...m,
            });
        }
    }

    completeHistory(historyId:number) {
        this.#dao.completeHistory(historyId);
    }

    getHistory(offset=0, limit=1000, desc=true) {
        const history = this.#dao.selectHistory({ offset, limit, desc });

        return history;
    }

    searchHistory(search:HistorySearchRow) {
        return this.#dao.searchHistory(search);
    }

    getMessageText(historyId:number):{input?:string, output?:string} {
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
            input : inputText.length === 0 ? undefined : inputText.join(' '),
            output : outputText.length === 0 ? undefined : outputText.join(' '),
        };
    }

    deleteMessage(historyId:number, origin:'in'|'out'|'both'='both') {
        let input = false;
        let output = false;
        this.#dao.selectMessageOrigin(historyId)
            .forEach(({ origin })=>{
                if (origin === 'in') input = true;
                else if (origin === 'out') output = true;
            });
            
        this.#dao.deleteMessages(historyId, origin);
        if (origin === 'in') {
            input = false;
        }
        else if (origin === 'out') {
            output = false;
        }
        else if (origin === 'both') {
            input = false;
            output = false;
        }

        if (!input && !output) {
            this.#dao.delete(historyId);
        }
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
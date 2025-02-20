import * as path from 'node:path';
import * as fs from 'node:fs';
import HistoryDAO from './HistoryDAO';
import type { HistoryData } from './types';
import { type IAccessor } from 'ac-storage';

class HistoryAccessor implements IAccessor{
    #dao:HistoryDAO;
    #droped:boolean = false;

    constructor(target:string) {
        this.#dao = new HistoryDAO(target);
    }

    get(offset=0, limit=1000) {
        return this.#dao.select(offset, limit);
    }

    append(chatType:string, data:HistoryData) {
        this.#dao.insert(chatType, data.input, data.output, JSON.stringify(data));
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
        this.#dao.commit();
    }
}

export default HistoryAccessor;
import { IPromptList, IPromptInfomation } from './interface.ts'
import {MainPrompt, SubPrompt, Vars} from '../../data/interface'

export class EmptyPromptList implements IPromptList {
    findValidPromptKey(expectedKey1, expectedKey2) {
        return [ null, null ];
    }

    getPrompt(key1:string, key2?:string):IPromptInfomation|null {
        return null;
    }

    get list() {
        return [];
    }
}
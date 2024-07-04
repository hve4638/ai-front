import { IPromptList, MainPromptCache, SubPromptCache } from './interface.ts'
import {MainPrompt, SubPrompt, Vars} from '../../data/interface'

export class EmptyPromptList implements IPromptList {
    findValidPromptKey(expectedKey1, expectedKey2) {
        return [ null, null ];
    }

    getPrompt(key1:string):MainPrompt|null;
    getPrompt(key1:string, key2:string):SubPrompt|null;
    getPrompt(key1:string, key2?:string):MainPrompt|SubPrompt|null {
        return null;
    }
}
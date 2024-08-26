import { IPromptList, IPromptInfomation } from '../types'

export class EmptyPromptList implements IPromptList {
    getPromptIndex(prompt1Key: string, prompt2Key?: string): number[] | null {
        throw new Error('Method not implemented.');
    }
    firstPrompt(): IPromptInfomation {
        throw new Error('Method not implemented.');
    }
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
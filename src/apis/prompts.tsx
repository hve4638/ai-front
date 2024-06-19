import {HOMEPAGE} from '../data/constants.tsx'

export function requestPromptlist(): Promise<any> {
    return fetch(`${HOMEPAGE}/prompts/list.json`).then(res=>res.json());
}

export function requestPrompt(filename:string): Promise<string> {
    return fetch(`${HOMEPAGE}/prompts/${filename}`).then(res=>res.text());
}
import {HOMEPAGE} from '../data/constants.tsx'

export function requestPromptlist(): Promise<any> {
    return fetch(`${HOMEPAGE}/prompts/list.json`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
    }).then(res=>res.json());
}

export function requestPrompt(filename:string): Promise<string> {
    return fetch(`${HOMEPAGE}/prompts/${filename}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
    }).then(res=>res.text());
}
import {HOMEPAGE} from '../data/constants.tsx'

interface Promptlist {
  prompts:object[],
  vars:object[]
}

export function requestPromptlist(): Promise<Promptlist> {
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
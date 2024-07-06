import {HOMEPAGE, TARGET_ENV} from '../data/constants.tsx'
import { REQUEST_ECHO } from '../data/ipc.js'; 

interface Promptlist {
  prompts:object[],
  vars:object[]
}

export function requestPromptlist():Promise<Promptlist> {
  switch(TARGET_ENV) {
    case "WEB":
      return WebInteractive.requestPromptlist();
    case "WINDOWS":
      return IPCInteractive.requestPromptlist();
  }
  throw new Error("");
}

export function requestPrompt(filename:string): Promise<string> {
  switch(TARGET_ENV) {
    case "WEB":
      return WebInteractive.requestPrompt(filename);
    case "WINDOWS":
      return IPCInteractive.requestPrompt(filename);
  }
  throw new Error("");
}

class IPCInteractive {
  static requestPromptlist():Promise<Promptlist> {
    return new Promise((resolve, reject)=>{
      //window.electron.echo("HELLO???").then(data=>console.log(`RESPONSE!!! ${data}`))
      reject();
    });
  }
  
  static requestPrompt(value:string):Promise<string> {
    return new Promise((resolve, reject)=>{
      reject();
    });
  }
}

class WebInteractive {
  static requestPromptlist():Promise<Promptlist> {
    return fetch(`${HOMEPAGE}/prompts/list.json`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
    }).then(res=>res.json());
  }
  
  static requestPrompt(value:string):Promise<string> {
    return fetch(`${HOMEPAGE}/prompts/${value}`, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    }).then(res=>res.text());
  }
}


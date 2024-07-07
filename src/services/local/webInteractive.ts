import { HOMEPAGE } from "../../data/constants.tsx";
import { Promptlist } from "./interface";
import { COOKIE_OPTION_NOEXPIRE } from "../../data/constants.tsx"
import { getCookie, setCookie } from "../../libs/cookies.tsx"

export class WebInteractive {
    static loadPromptlist():Promise<Promptlist> {
      return fetch(`${HOMEPAGE}/prompts/list.json`, {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
      }).then(res=>res.json());
    }
    
    static loadPrompt(value:string):Promise<string> {
      return fetch(`${HOMEPAGE}/prompts/${value}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      }).then(res=>res.text());
    }
    
    static storeValue(name:string, value:any) {
        setCookie(name, value, COOKIE_OPTION_NOEXPIRE);
    }

    static loadValue(name:string):any|undefined {
        return getCookie(name);
    }

    static fetch(url, init) {
      return fetch(url, init)
      .then(async (res)=>{
        const data = await res.json();
        if (!res.ok) {
          throw data.error.message;
        }
        return data;
      });
    }
  }
  
  
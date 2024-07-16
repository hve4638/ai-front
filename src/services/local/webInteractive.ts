import { HOMEPAGE } from "../../data/constants.tsx";
import { Promptlist } from "./interface";
import { COOKIE_OPTION_NOEXPIRE } from "../../data/constants.tsx"
import { getCookie, setCookie } from "../../libs/cookies.tsx"
import { getCookies, removeCookie } from "../../libs/cookies.tsx";

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
        return new Promise<any>((resolve, reject)=>{
          resolve(getCookie(name));
        })
    }

    static async fetch(url, init) {
        try {
            const res = await fetch(url, init);
    
            if (!res.ok) {
                return {
                    ok : false,
                    reason : "HTTP Error",
                    status : res.status
                }
            }
            else {
                const data = await res.json();
                return {
                    ok : true,
                    data : data
                }
            }
        }
        catch(error) {
            return {
                ok : false,
                reason : "Unexpected Error",
                error :  `${error}`
            }
        }
    }
    
    static openBrowser(url) {
      window.open(url);
    }

    static resetAllValues() {
      for (const name of getCookies()) {
          removeCookie(name);
      }
    }
    
    static loadHistory(sessionid) {
      return [];
    }
  }
  
  
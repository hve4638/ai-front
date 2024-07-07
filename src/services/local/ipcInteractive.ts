import { Promptlist } from "./interface";

export class IPCInteractive {
    static loadPromptlist():Promise<Promptlist> {
      return new Promise((resolve, reject)=>{
        window.electron.loadPromptList()
        .then((data)=>{
          resolve(JSON.parse(data))
        })
        .catch((err)=>{
          console.log('err')
          reject(err);
        });
      });
    }
    
    static loadPrompt(value:string):Promise<string> {
      return new Promise((resolve, reject)=>{
        window.electron.loadPrompt(value)
        .then((data)=>{
          resolve(data)
        })
        .catch((err)=>{
          reject(err);
        });
      });
    }

    static openPromptFolder() {
        window.electron.openPromptFolder();
    }

    static storeValue(name:string, value:any) {
        return new Promise((resolve, reject)=>{
            window.electron.storeValue(name, value)
        });
    }

    static loadValue(name:string):any|undefined {
        return new Promise((resolve, reject)=>{
            window.electron.loadValue(name)
            .then((data)=>resolve(data))
            .catch((err)=>reject(err))
        });
    }
    
    static storeSecretValue(name:string, value:any) {
      return new Promise((resolve, reject)=>{
          window.electron.storeSecretValue(name, value)
      });
    }

    static loadSecretValue(name:string):any|undefined {
        return new Promise((resolve, reject)=>{
            window.electron.loadSecretValue(name)
            .then((data)=>resolve(data))
            .catch((err)=>reject(err))
        });
    }
    
    static fetch(url, init) {
      return window.electron.fetch(url, init);
    }
}
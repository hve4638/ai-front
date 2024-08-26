import { RootPromptMetadata } from 'features/prompts';
import { Promptlist } from './interface';

const electron:any = window.electron;

export class IPCInteractive {
    static loadPromptMetadata():Promise<RootPromptMetadata> {
      return new Promise((resolve, reject)=>{
        electron.loadPromptList()
        .then((data)=>{
          resolve(JSON.parse(data))
        })
        .catch((err)=>{
          reject(err);
        });
      });
    }

    static loadPrompt(value:string):Promise<string> {
      return new Promise((resolve, reject)=>{
        electron.loadPrompt(value)
        .then((data)=>{
          resolve(data)
        })
        .catch((err)=>{
          reject(err);
        });
      });
    }

    static openPromptFolder() {
      electron.openPromptFolder();
    }

    static storeValue(name:string, value:any) {
        return new Promise((resolve, reject)=>{
          electron.storeValue(name, value)
        });
    }

    static loadValue(name:string):any|undefined {
        return new Promise((resolve, reject)=>{
          electron.loadValue(name)
            .then((data)=>resolve(data))
            .catch((err)=>reject(err))
        });
    }

    static storeSecretValue(name:string, value:any) {
        return new Promise((resolve, reject)=>{
        electron.storeSecretValue(name, value)
        });
    }

    static loadSecretValue(name:string):any|undefined {
        return new Promise((resolve, reject)=>{
            electron.loadSecretValue(name)
            .then((data)=>resolve(data))
            .catch((err)=>reject(err))
        });
    }

    static fetch(url, init) {
      return electron.fetch(url, init);
    }

    static openBrowser(url) {
        electron.openBrowser(url);
    }

    static resetAllValues() {
        electron.resetAllValues();
    }

    static storeHistory(sessionid:number, data:any) {
        electron.storeHistory(sessionid, data);
    }

    static async loadHistory(sessionid:number, offset:number, limit:number) {
        return await electron.loadHistory(sessionid, offset, limit);
    }

    static deleteHistory(sessionid:number) {
        electron.deleteHistory(sessionid);
    }
}
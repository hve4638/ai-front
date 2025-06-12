import { IACSubStorage } from 'ac-storage';

class ProfileSession {
    private sessionStorage:IACSubStorage;

    /**
     * @param storage 
     */
    constructor(private storage:IACSubStorage, private sessionId:string) {
        this.sessionStorage = storage.subStorage(`session:${this.sessionId}`);
    }
 
    private async accessRTIndex(rtId:string) {
        return this.storage.accessAsJSON(`request-template:${rtId}:index.json`);
    }
    private async accessData() {
        return this.sessionStorage.accessAsJSON(`data.json`);
    }
    
    async get(accessorId:string, keys:string[]) {
        const ac = await this.sessionStorage.accessAsJSON(accessorId);
        return ac.get(...keys);
    }
    
    async getOne(accessorId:string, key:string) {
        const ac = await this.sessionStorage.accessAsJSON(accessorId);
        return ac.getOne(key);
    }

    async set(accessorId:string, data:KeyValueInput) {
        const ac = await this.sessionStorage.accessAsJSON(accessorId);
        return ac.set(data);
    }
    
    async setOne(accessorId:string, key:string, value:any) {
        const ac = await this.sessionStorage.accessAsJSON(accessorId);
        return ac.setOne(key, value);
    }
    
    async getFormValues(rtId:string) {
        const dataAC = await this.accessData();

        const values = (await dataAC.getOne(`forms.${rtId}`)) ?? {};
        return values;
    }
    async setFormValues(rtId:string, values:Record<string, any>) {
        const rtIndexAC = await this.accessRTIndex(rtId);
        const dataAC = await this.accessData();

        const formIds = rtIndexAC.getOne('forms') ?? [];
        for (const formId of formIds) {
            if (!(formId in values)) continue;

            const value = values[formId];
            dataAC.setOne(`forms.${rtId}.${formId}`, value);
        }
    }
}

export default ProfileSession;
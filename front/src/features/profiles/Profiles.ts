import LocalAPI from 'api/local';
import LocaLAPI from 'api/local';

class Profiles {
    #names?:string[];
    #lastName?:string|null;
    #loaded:boolean = false;

    constructor() {
        const load = async ()=>{
            this.#names = await LocaLAPI.getProfileNames();
            this.#lastName = await LocalAPI.getLastProfileName();
            this.#loaded = true;
        }

        this.#loaded = false;
        load();
    }

    get profileNames():string[]|null|undefined {
        return this.#names;
    }

    get lastProfileName():string|null|undefined {
        return this.#lastName;
    }

    get loaded() {
        return this.#loaded;
    }
}

export default Profiles;
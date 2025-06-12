import { IJSONFS, JSONAccessor } from 'ac-storage';

import JSONSecureFS from './JSONSecureFS';

class SecretJSONAccessor extends JSONAccessor {
    initialized: boolean = false;
    loaded: boolean = false;

    initializeKey(key:string) {
        this.jsonFS = new JSONSecureFS(key);
        this.initialized = true;
    }

    override async load(): Promise<void> {
        if (!this.initialized) return;
        if (this.loaded) return;

        await super.load();
        this.loaded = true;
    }
}

export default SecretJSONAccessor;

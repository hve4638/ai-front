import { IJSONFS, JSONAccessor } from 'ac-storage';

import JSONSecureFS from './JSONSecureFS';

class SecretJSONAccessor extends JSONAccessor {
    initializeKey(key:string) {
        this.jsonFS = new JSONSecureFS(key);
    }
}

export default SecretJSONAccessor;

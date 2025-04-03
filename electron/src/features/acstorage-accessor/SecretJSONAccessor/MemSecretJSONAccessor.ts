import SecretJSONAccessor from './SecretJSONAccessor';
import { JSONTree } from 'ac-storage';

class MemSecretJSONAccessor extends SecretJSONAccessor {
    constructor(tree:JSONTree) {
        super('', tree);
        this.jsonFS = undefined;
    }
    override initializeKey(key:string) {
        this.jsonFS = undefined;
    }
}

export default MemSecretJSONAccessor;

import UniqueKeyManager from './UniqueKeyManager';

class MockUniqueKeyManager extends UniqueKeyManager {
    constructor() {
        super('');
    }
    override initKeyFile() {
        
    }
    override existsKeyFile():boolean {
        return true;
    }
    override readFile():string {
        return '';
    }
    override writeFile(text:string) {
        
    }
    override deleteKeyFile() {
        
    }

    override async readKey() {
        return '1234';
    }
}

export default MockUniqueKeyManager;
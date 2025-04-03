import { Gen0 } from './encrypt-model';
import MasterKeyManager from './MasterKeyManager';

class MemMasterKeyManager extends MasterKeyManager {
    constructor() {
        super('');
    }
    override fsUtil = new MemFSUtil();
    override encryptModel = new Gen0();
}

class MemFSUtil {
    async readData(target:string):Promise<string[]> {
        return [];
    }

    async writeData(target:string, data:string[]):Promise<void> {
        
    }
}

export default MemMasterKeyManager;
import { Gen1, IEncryptModel } from './encrypt-model';


class MasterKeyEncryptUtil {
    private encryptModel: IEncryptModel = new Gen1();
    private encryptedAsHardwareKey: string | null = null;
    
    constructor(private masterKey: string) {

    }

    async encrypt(key:string): Promise<string> {
        this.encryptedAsHardwareKey ??= await this.encryptModel.encrypt(this.masterKey, key);

        return this.encryptedAsHardwareKey;
    }

    
}

export default MasterKeyEncryptUtil;
import { Gen1, type IEncryptModel } from './encrypt-model';
import { MasterKeyInitResult } from './types'
import UniqueKeyFS from './FSUtil';
import UniqueIdentifier from './UniqueIdentifier';


class MasterKeyManager {
    protected fsUtil = new UniqueKeyFS();
    protected encryptModel:IEncryptModel = new Gen1();
    #rawEncryptionData:string[] = [];

    #masterKey:string|null = null;
    #hardwareKey:string|null = null;

    constructor(protected target:string) {
          
    }
    
    get masterKey():string|null {
        return this.#masterKey;
    }

    async init():Promise<MasterKeyInitResult> {
        if (!this.#rawEncryptionData) {
            const result = await this.#setupRawEncryptionData();
            if (result != null) return result;
        }

        if (!this.#hardwareKey) {
            const result = await this.#setupHardwareKey();
            if (result != null) return result;
        }

        if (!this.#masterKey) {
            const result = await this.#setupMasterKey();
            if (result != null) return result;
        }
        
        return MasterKeyInitResult.Normal;
    }

    async #setupRawEncryptionData():Promise<undefined|MasterKeyInitResult> {
        if (!this.#rawEncryptionData) {
            try {
                const data = await this.fsUtil.readData(this.target);
                if (data.length === 0) {
                    return MasterKeyInitResult.NoData;
                }
                this.#rawEncryptionData = data;
            }
            catch(e) {
                return MasterKeyInitResult.InvalidData;
            }
        }
        return;
    }

    async #setupHardwareKey() {
        try {
            this.#hardwareKey ??= await UniqueIdentifier.makeAsHardwareNames();
        }
        catch (e) {
            return MasterKeyInitResult.UnexpectedError;
        }
    }

    async #setupMasterKey():Promise<MasterKeyInitResult|undefined> {
        if (this.#rawEncryptionData.length === 0) return MasterKeyInitResult.NoData;
        const encryptData = this.#rawEncryptionData[0];

        try {
            const decrypted = await this.encryptModel.decrypt(encryptData, this.#hardwareKey!);
            this.#masterKey = decrypted;
        }
        catch(e) {
            return MasterKeyInitResult.NeedRecovery;
        }
        return;
    }

    async resetKey(...recoveryKeys:string[]) {
        const masterKey = await this.encryptModel.generateKey();
        const mainEnc = await this.encryptModel.encrypt(masterKey, this.#hardwareKey!);
        const recoveryEnc = await Promise.all(recoveryKeys.map((key) => this.encryptModel.encrypt(masterKey, key)));

        this.fsUtil.writeData(this.target, [mainEnc, ...recoveryEnc]);
        this.#masterKey = masterKey;
    }

    async mockResetKey(masterKey:string) {
        this.#masterKey = masterKey;
    }

    async recoveryMasterKey(recoveryKey:string):Promise<boolean> {
        if (!this.#rawEncryptionData) throw new Error('Not initialized');
        if (!this.#hardwareKey) throw new Error('Not initialized');

        let decrypted:string|null = null;
        for (const data of this.#rawEncryptionData) {
            try {
                decrypted = await this.encryptModel.decrypt(data, recoveryKey);
            }
            catch(e) {
                return false;
            }
        }
        if (decrypted) {
            this.#masterKey = decrypted;
            return true;
        }
        return false;
    }
}

export default MasterKeyManager;
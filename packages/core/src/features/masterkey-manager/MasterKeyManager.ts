import { Gen1, type IEncryptModel } from './encrypt-model';
import { MasterKeyInitResult } from './types'
import UniqueKeyFS from './FSUtil';
import UniqueIdentifier from './UniqueIdentifier';
import MasterKeyEncryptUtil from './MasterKeyEncryption';
import { LevelLogger } from '@/types';
import NoLogger from '../nologger';
import { IMasterKeyGettable } from './types';

class MasterKeyManager implements IMasterKeyGettable {
    protected fsUtil = new UniqueKeyFS();
    protected encryptModel: IEncryptModel = new Gen1();
    #rawEncryptionData: string[] = [];

    #masterKey: string | null = null;
    #hardwareKey: string | null = null;

    #logger: LevelLogger;

    constructor(protected target: string, logger?: LevelLogger) {
        this.#logger = logger ?? NoLogger.instance;
    }

    get masterKey(): string | null {
        return this.#masterKey;
    }

    /**
     * 마스터 키 초기화 작업을 진행하고 오류 상태 반환
     */
    async init(): Promise<MasterKeyInitResult> {
        this.#logger.info(`Initializing MasterKeyManager`);
        if (this.#rawEncryptionData.length === 0) {
            const result = await this.#setupRawEncryptionData();
            if (result != null) {
                this.#logger.trace(`Failed to initialize raw encryption data: ${result}`);
                return result;
            }
            this.#logger.trace(`Raw encryption data initialized`);
        }
        else {
            this.#logger.trace(`Raw encryption data already initialized`);
        }

        if (!this.#hardwareKey) {
            const result = await this.#setupHardwareKey();
            if (result != null) {
                this.#logger.trace(`Failed to initialize hardware key: ${result}`);
                return result;
            }
            this.#logger.trace(`Hardware key initialized`);
        }
        else {
            this.#logger.trace(`Hardware key already initialized`);
        }

        if (!this.#masterKey) {
            const result = await this.#setupMasterKey();
            if (result != null) {
                this.#logger.trace(`Failed to initialize master key: ${result}`);
                return result;
            }
            this.#logger.trace(`Master key initialized`);
        }
        else {
            this.#logger.trace(`Master key already initialized`);
        }

        return MasterKeyInitResult.Normal;
    }

    async #setupRawEncryptionData(): Promise<undefined | MasterKeyInitResult> {
        try {
            const data = await this.fsUtil.readData(this.target);
            if (data.length === 0) {
                return MasterKeyInitResult.NoData;
            }
            this.#rawEncryptionData = data;
        }
        catch (e) {
            return MasterKeyInitResult.InvalidData;
        }
    }

    async #setupHardwareKey() {
        try {
            this.#hardwareKey ??= await UniqueIdentifier.makeAsHardwareNames();
        }
        catch (e) {
            return MasterKeyInitResult.UnexpectedError;
        }
    }

    async #setupMasterKey(): Promise<MasterKeyInitResult | undefined> {
        if (this.#rawEncryptionData.length === 0) return MasterKeyInitResult.NoData;

        for (const encrypted of this.#rawEncryptionData) {
            try {
                const decrypted = await this.encryptModel.decrypt(encrypted, this.#hardwareKey!);
                this.#masterKey = decrypted;
                return;
            }
            catch (e) {
                continue;
            }
        }
        return MasterKeyInitResult.NeedRecovery;
    }

    /**
     * 마스터 키를 재설정하고 하드웨어 키와 복구 키를 통해 암호화해 저장
     */
    async resetKey(...recoveryKeys: string[]) {
        this.#masterKey = await this.encryptModel.generateKey();
        this.#logger.debug(`Resetting master key`);
        this.#logger.trace(`Generate new master key: ${this.#masterKey}`);

        await this.fsUtil.deleteData(this.target);
        await this.bindHardwareKey();
        await this.bindRecoveryKeys(...recoveryKeys);
    }

    async rebindKey(...recoveryKeys: string[]) {
        if (!this.#masterKey) throw new Error('Master key is not initialized or loaded');
        this.#logger.debug(`Rebind master key`);

        await this.fsUtil.deleteData(this.target);
        await this.bindHardwareKey();
        await this.bindRecoveryKeys(...recoveryKeys);
    }

    async bindRecoveryKeys(...recoveryKeys: string[]) {
        const encrypted = await this.encryptMasterKey(...recoveryKeys);
        
        await this.fsUtil.appendData(this.target, encrypted);
        this.#logger.trace(`Encrypt master key with recovery keys: ${recoveryKeys.join(', ')}`);
    }

    async bindHardwareKey() {
        const hardwareKey = await this.getHardwareKey();
        const encrypted = await this.encryptMasterKey(hardwareKey);
        
        await this.fsUtil.appendData(this.target, encrypted);
        this.#logger.trace(`Encrypt master key with hardware key`);
    }

    /**
     * 마스터 키를 암호화하고 저장
     * 
     * @param recoveryKeys 
     */
    private async encryptMasterKey(...keys: string[]):Promise<string[]> {
        if (!this.masterKey) throw new Error('Master key is not initialized or loaded');
        
        const encryptUtil = new MasterKeyEncryptUtil(this.masterKey);
        return await Promise.all(keys.map((key) => encryptUtil.encrypt(key)));
    }

    private async getHardwareKey(): Promise<string> {
        if (!this.#hardwareKey) {
            if (await this.#setupHardwareKey() != null) {
                this.#logger.error('Failed to setup hardware key');
                throw new Error('Failed to setup hardware key');
            }

            return this.#hardwareKey as string;
        }
        return this.#hardwareKey;
    }

    async mockResetKey(masterKey: string) {
        this.#masterKey = masterKey;
    }

    /**
     * 복구 키를 통해 마스터 키를 복구
     */
    async recoveryMasterKey(recoveryKey: string): Promise<boolean> {
        if (!this.#rawEncryptionData) throw new Error('Not initialized');
        if (!this.#hardwareKey) throw new Error('Not initialized');
        this.#logger.debug(`Trying to recover master key with recovery key: ${recoveryKey}`);

        let decrypted: string | null = null;
        for (const i in this.#rawEncryptionData) {
            const data = this.#rawEncryptionData[i];
            this.#logger.trace(`Trying to decrypt with recovery key: ${data} [${i}]`);

            try {
                decrypted = await this.encryptModel.decrypt(data, recoveryKey);
                this.#logger.trace('successfully decrypted with recovery key');
                break;
            }
            catch (e) {
                this.#logger.trace('failed to decrypt with recovery key');
                continue;
            }
        }
        if (decrypted) {
            this.#masterKey = decrypted;
            this.#logger.debug(`Master key recovered`);
            
            return true;
        }
        return false;
    }
}

export default MasterKeyManager;
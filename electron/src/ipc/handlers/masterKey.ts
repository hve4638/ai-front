import { uniqueKeyManager } from '@ipc/registry';
import { IPCCommand } from '@types';

function handler() {
    return {
        /* 마스터키 */
        [IPCCommand.InitMasterKey] : async () => {
            await uniqueKeyManager.readKey();

            return [null] as const;
        },
        [IPCCommand.CheckMasterKeyExistence] : async () => {
            return [null, uniqueKeyManager.existsKey()] as const;
        }, 
        [IPCCommand.ValidateMasterKey] : async () => {
            const key = uniqueKeyManager.getKey();

            return [null, key !== null] as const;
        },
        [IPCCommand.GenerateMasterKey] : async (recoveryKey:string) => {
            await uniqueKeyManager.generateKey(recoveryKey);

            return [null] as const;
        },
        [IPCCommand.ResetMasterKey] : async () => {
            uniqueKeyManager.resetKey();

            return [null] as const;
        },
        [IPCCommand.RecoverMasterKey] : async (recoveryKey:string) => {
            const success = await uniqueKeyManager.tryRecoveryKey(recoveryKey);

            return [null, success] as const;
        },
    }
}

export default handler;
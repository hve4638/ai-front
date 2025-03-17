import { uniqueKeyManager } from '@ipc/registry';
import { IPCInvokerName } from 'types';

function handler() {
    return {
        /* 마스터키 */
        [IPCInvokerName.InitMasterKey] : async () => {
            await uniqueKeyManager.readKey();

            return [null] as const;
        },
        [IPCInvokerName.CheckMasterKeyExistence] : async () => {
            return [null, uniqueKeyManager.existsKey()] as const;
        }, 
        [IPCInvokerName.ValidateMasterKey] : async () => {
            const key = uniqueKeyManager.getKey();

            return [null, key !== null] as const;
        },
        [IPCInvokerName.GenerateMasterKey] : async (recoveryKey:string) => {
            await uniqueKeyManager.generateKey(recoveryKey);

            return [null] as const;
        },
        [IPCInvokerName.ResetMasterKey] : async () => {
            uniqueKeyManager.resetKey();

            return [null] as const;
        },
        [IPCInvokerName.RecoverMasterKey] : async (recoveryKey:string) => {
            const success = await uniqueKeyManager.tryRecoveryKey(recoveryKey);

            return [null, success] as const;
        },
    }
}

export default handler;
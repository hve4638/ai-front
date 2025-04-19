import { MasterKeyInitResult } from '@/features/master-key';
import runtime from '@/runtime';
import { IPCInvokerName } from 'types';

function handler() {
    return {
        /* 마스터키 */
        [IPCInvokerName.InitMasterKey] : async () => {
            const result = await runtime.masterKeyManager.init();
            switch(result) {
                case MasterKeyInitResult.InvalidData:
                    return [null, 'invalid-data'] as const;
                case MasterKeyInitResult.NoData:
                    return [null, 'no-data'] as const;
                case MasterKeyInitResult.NeedRecovery:
                    return [null, 'need-recovery'] as const;
                case MasterKeyInitResult.Normal:
                    return [null, 'normal'] as const;
                default:
                    return [{ name : 'InitializeFail', message: '', value: 'other' }] as const;
            }
        },
        [IPCInvokerName.ResetMasterKey] : async (recoveryKey:string) => {
            await runtime.masterKeyManager.resetKey(recoveryKey);
            return [null] as const;
        }, 
        [IPCInvokerName.RecoverMasterKey] : async (recoveryKey:string) => {
            const success = await runtime.masterKeyManager.recoveryMasterKey(recoveryKey);
            return [null, success] as const;
        },
    }
}

export default handler;
import { MasterKeyInitResult } from '@/features/master-key';
import runtime from '@/runtime';
import { IPCInvokerName } from 'types';

function handler():IPCInvokerMasterKey {
    return {
        async init() {
            const result = await runtime.masterKeyManager.init();
            switch(result) {
                case MasterKeyInitResult.InvalidData:
                    return [null, 'invalid-data'];
                case MasterKeyInitResult.NoData:
                    return [null, 'no-data'] as const;
                case MasterKeyInitResult.NeedRecovery:
                    return [null, 'need-recovery'] as const;
                case MasterKeyInitResult.Normal:
                    return [null, 'normal'] as const;
                default:
                    const err = { name : 'InitializeFail', message: '', value: 'other' };
                    return [err] as const;
            }
        },
        async reset(recoveryKey:string) {
            await runtime.masterKeyManager.resetKey(recoveryKey);
            return [null] as const;
        }, 
        async recover(recoveryKey:string) {
            const success = await runtime.masterKeyManager.recoveryMasterKey(recoveryKey);
            return [null, success];
        },
    }
}

export default handler;
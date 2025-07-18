import { MasterKeyInitResult } from '@afron/core';
import runtime from '@/runtime';
import { IPCInvokerName } from 'types';

function handler():IPCInvokerMasterKey {
    return {
        async init() {
            const result = await runtime.masterKeyManager.init();
            switch(result) {
                case MasterKeyInitResult.InvalidData:
                    runtime.logger.warn('Master key initialization failed: Invalid data');
                    return [null, 'invalid-data'];
                case MasterKeyInitResult.NoData:
                    runtime.logger.info('Master key initialization failed: No data');
                    return [null, 'no-data'] as const;
                case MasterKeyInitResult.NeedRecovery:
                    runtime.logger.warn('Master key initialization failed: Need recovery');
                    return [null, 'need-recovery'] as const;
                case MasterKeyInitResult.Normal:
                    runtime.logger.info('Master key initialized successfully');
                    return [null, 'normal'] as const;
                default:
                    const err = { name : 'InitializeFail', message: '', value: 'other' };
                    return [err] as const;
            }
        },
        async reset(recoveryKey:string) {
            runtime.logger.info(`Resetting master key`);
            await runtime.masterKeyManager.resetKey(recoveryKey);
            return [null] as const;
        }, 
        async recover(recoveryKey:string) {
            runtime.logger.info(`Try to recover master key with recovery key`);
            const configAC = await runtime.globalStorage.accessAsJSON('config.json');
            const sharedMode = configAC.getOne('shared_mode');

            const success = await runtime.masterKeyManager.recoveryMasterKey(recoveryKey);
            if (success) {
                runtime.logger.info(`Master key recovered successfully`);

                if (sharedMode) {
                    runtime.logger.info(`Binding master key as new hardware key`);
                    await runtime.masterKeyManager.bindHardwareKey();
                }
                else {
                    runtime.logger.info(`Rebinding master key`);
                    await runtime.masterKeyManager.rebindKey(recoveryKey);
                }
            }
            else {
                runtime.logger.info(`Master key recovery failed`);
            }
            return [null, success];
        },
    }
}

export default handler;
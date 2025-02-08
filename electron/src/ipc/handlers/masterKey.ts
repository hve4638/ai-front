import * as utils from '@utils';
import ChatAIModels from '@features/chatai-models';
import PING from '@ipc/ipcping';

import { uniqueKeyManager } from '@ipc/registry';

function handler() {
    return {
        /* 마스터키 */
        [PING.INIT_MASTER_KEY] : async () => {
            await uniqueKeyManager.readKey();

            return [null] as const;
        },
        [PING.IS_MASTER_KEY_EXISTS] : async () => {
            return [null, uniqueKeyManager.existsKey()] as const;
        }, 
        [PING.VALIDATE_MASTER_KEY] : async () => {
            const key = uniqueKeyManager.getKey();

            return [null, key !== null] as const;
        },
        [PING.GENERATE_MASTER_KEY] : async (recoveryKey:string) => {
            await uniqueKeyManager.generateKey(recoveryKey);

            return [null] as const;
        },
        [PING.RESET_MASTER_KEY] : async () => {
            uniqueKeyManager.resetKey();

            return [null] as const;
        },
        [PING.RECOVER_MASTER_KEY] : async (recoveryKey:string) => {
            const success = await uniqueKeyManager.tryRecoveryKey(recoveryKey);

            return [null, success] as const;
        },
    }
}

export default handler;
import * as utils from '@utils';
import ChatAIModels from '@features/chatai-models';
import PING from '@ipc/ipcping';

import { globalStorage } from '@ipc/registry';

function handler() {
    return {
        [PING.GET_GLOBAL_DATA] : async (identifier:string, key:string) => {
            const accessor = globalStorage.getJSONAccessor(identifier);

            return [null, accessor.get(key)] as const;
        },
        [PING.SET_GLOBAL_DATA] : async (identifier:string, key:string, value:any) => {
            const accessor = globalStorage.getJSONAccessor(identifier);

            accessor.set(key, value);
            return [null] as const;
        },
    }
}

export default handler;
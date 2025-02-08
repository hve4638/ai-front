import * as utils from '@utils';
import ChatAIModels from '@features/chatai-models';
import PING from '@ipc/ipcping';

import {  } from '@ipc/registry';

function handler() {
    return {
        [PING.ECHO] : async (message:string) => {
            return [null, message] as const;
        },
        [PING.OPEN_BROWSER] : async (url:string) => {
            utils.openBrowser(url);
            
            return [null] as const;
        },
        [PING.GET_CHATAI_MODELS] : async () => {
            return [null, ChatAIModels.models] as const;
        },
    }
}

export default handler;
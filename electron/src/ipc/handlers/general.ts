import * as utils from '@utils';
import { IPCInvokerName } from 'types';
import ChatAIModels from '@/features/chatai-models';

function handler() {
    return {
        [IPCInvokerName.Echo] : async (message:string) => {
            return [null, message] as const;
        },
        [IPCInvokerName.OpenBrowser] : async (url:string) => {
            utils.openBrowser(url);
            
            return [null] as const;
        },
        [IPCInvokerName.GetChatAIModels] : async () => {
            return [null, ChatAIModels.models] as const;
        },
    }
}

export default handler;
import * as utils from '@utils';
import { IPCCommand } from 'types';
import ChatAIModels from '@features/chatai-models';

function handler() {
    return {
        [IPCCommand.Echo] : async (message:string) => {
            return [null, message] as const;
        },
        [IPCCommand.OpenBrowser] : async (url:string) => {
            utils.openBrowser(url);
            
            return [null] as const;
        },
        [IPCCommand.GetChatAIModels] : async () => {
            return [null, ChatAIModels.models] as const;
        },
    }
}

export default handler;
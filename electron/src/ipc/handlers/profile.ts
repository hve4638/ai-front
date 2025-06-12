import runtime from '@/runtime';
import ChatAIModels from '@/features/chatai-models';

function handler():IPCInvokerProfile {
    return {
        async getChatAIModels(profileId: string) {
            return [null, ChatAIModels.models];
        },
    }
}

export default handler;
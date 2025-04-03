import PromptTemplate, { CBFResult } from '@hve/prompt-template';
import { GlobalNodeOption, WorkLog } from '../types';
import { BUILT_IN_VARS, HOOKS } from '../data';
import WorkNode from './Node';
import ChatAI, { KnownProvider } from '@hve/chatai';
import ChatAIModels from '@/features/chatai-models';

type ChatAIFetchNodeInput = {
    prompt:Generator<CBFResult>;
}
type ChatAIFetchNodeOutput = {
    message:string;
}
type ChatAIFetchNodeOption = {
    // specificModelId?:string;
}

class ChatAIFetchNode extends WorkNode<ChatAIFetchNodeInput, ChatAIFetchNodeOutput, ChatAIFetchNodeOption>  {
    async process(
        input:ChatAIFetchNodeInput,
        nodeOption:ChatAIFetchNodeOption,
        globalOption:GlobalNodeOption,
        workLog:WorkLog[]
    ) {
        const {
            profile, rtId, modelId
        } = globalOption;
        const {
            
        } = nodeOption;

        const modelData = ChatAIModels.getModel(modelId);
        if (!modelData) throw new Error(`Model not found: ${modelId}`);
        const { name : modelName, providerName } = modelData;

        const chatAI = new ChatAI();
        const result = await chatAI.request({
            model_name: modelName,
            provider: providerName as KnownProvider,
            message: [
                
            ],
            secret: {
                api_key: 'undefined'
            }
        });
        // response.message = response.message.join('');

        return {
            message: result.response.content[0]
        };
    }
}

export default ChatAIFetchNode;
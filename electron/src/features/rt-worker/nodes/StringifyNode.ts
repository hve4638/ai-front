import PromptTemplate, { CBFResult } from '@hve/prompt-template';
import { Chat, ChatRole, ChatRoleName, ChatType } from '@hve/chatai';
import { GlobalRTFlowData, WorkLog } from '../types';
import { BUILT_IN_VARS, HOOKS } from '../data';
import WorkNode from './WorkNode';
import { ChatML, PromptMessages } from './node-types';

export type StringifyChatMLNodeInput = {
    promptMessage: PromptMessages;
}
export type StringifyChatMLNodeOutput = {
    chatML: ChatML;
}
export type StringifyChatMLNodeOption = {
    
}

class StringifyChatMLNode extends WorkNode<StringifyChatMLNodeInput, StringifyChatMLNodeOutput, StringifyChatMLNodeOption>  {
    override async process(
        input:StringifyChatMLNodeInput,
    ) {
        const { promptMessage } = input;
        const result: string[] = [];

        for (const message of promptMessage) {
            const text = message.content.filter((item) => item.chatType === 'TEXT').map((item) => item.text).join('');
            result.push(`${text}`);
        }
        
        
        return {
            chatML : result.join('\n'),
        };
    }
}

export default StringifyChatMLNode;
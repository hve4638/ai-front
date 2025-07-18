import { ChatMessages } from '@hve/chatai';
import WorkNode from './WorkNode';
import { ChatML } from './node-types';

export type StringifyChatMLNodeInput = {
    promptMessage: ChatMessages;
}
export type StringifyChatMLNodeOutput = {
    chatML: ChatML;
}
export type StringifyChatMLNodeOption = {
    
}

class StringifyChatMLNode extends WorkNode<StringifyChatMLNodeInput, StringifyChatMLNodeOutput, StringifyChatMLNodeOption>  {
    override name = 'StringifyChatMLNode';
    
    override async process(
        input:StringifyChatMLNodeInput,
    ) {
        const { promptMessage } = input;
        const result: string[] = [];

        for (const message of promptMessage) {
            const text = message.content.filter((item) => item.chatType === 'Text').map((item) => item.text).join('');
            result.push(`${text}`);
        }
        
        
        return {
            chatML : result.join('\n'),
        };
    }
}

export default StringifyChatMLNode;
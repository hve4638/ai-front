import WorkNode from './WorkNode';
import { ChatML, PromptMessages } from './node-types';

export type StringifyChatMLNodeInput = {
    messages: PromptMessages;
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
        const { messages } = input;
        const result: string[] = [];

        for (const message of messages) {
            switch (message.role) {
                case 'User':
                    result.push(`<|im_start|>user`);
                    break;
                case 'Assistant':
                    result.push(`<|im_start|>assistant`);
                    break;
                case 'System':
                    result.push(`<|im_start|>system`);
                    break;
            }

            const text = message.content.filter((item) => item.chatType === 'TEXT').map((item) => item.text).join('');
            result.push(`${text}`);
            result.push(`<|im_end|>`);
        }
        
        
        return {
            chatML : result.join('\n'),
        };
    }
}

export default StringifyChatMLNode;
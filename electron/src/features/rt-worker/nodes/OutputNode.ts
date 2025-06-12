import { ChatAIResult } from '@hve/chatai';
import WorkNode from './WorkNode';

export type PromptBuildNodeInput = {
    output: ChatAIResult|string;
}
export type PromptBuildNodeOutput = {
    
}
export type PromptBuildNodeOption = {
    
}

class OutputNode extends WorkNode<PromptBuildNodeInput, PromptBuildNodeOutput, PromptBuildNodeOption>  {
    override name = 'OutputNode';
    
    override async process(
        nodeInput:PromptBuildNodeInput,
    ) {
        const { sender, data } = this.nodeData;
        const { output } = nodeInput;
        
        if (typeof output === 'string') {
            data.output.push({
                type: 'text',
                text: output,
                data: null,
                token_count: 5,
            });

            sender.sendResult(output);
            return {};
        }
        else {
            data.output.push({
                type: 'text',
                text: output.response.content.join('\n'),
                data: null,
                token_count: output.response.tokens.output,
            });

            sender.sendResult(output.response.content.join('\n'));
            return {};
        }
    }
}

export default OutputNode;
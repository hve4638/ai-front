import WorkNode from './WorkNode';

export type PromptBuildNodeInput = {
    output: string;
}
export type PromptBuildNodeOutput = {
    
}
export type PromptBuildNodeOption = {
    
}

class OutputNode extends WorkNode<PromptBuildNodeInput, PromptBuildNodeOutput, PromptBuildNodeOption>  {
    override async process(
        nodeInput:PromptBuildNodeInput,
    ) {
        const { sender, data } = this.nodeData;
        const { output } = nodeInput;
        
        data.output.push({
            type: 'text',
            text: output,
            data: null,
            token_count: 0,
        });

        sender.sendResult(output);
        return {};
    }
}

export default OutputNode;
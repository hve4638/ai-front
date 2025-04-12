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
        input:PromptBuildNodeInput,
    ) {
        const { output } = input;

        this.nodeData.sender.sendResult(output);

        return {};
    }
}

export default OutputNode;
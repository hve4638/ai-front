import { InputNode, NodeData, OutputNode, PromptBuildNode } from '../nodes';
import { StringifyChatMLNode } from '../nodes';
import RTWorkflow from './RTWorkflow';

class RTWorkflowPromptOnly extends RTWorkflow {
    async process(input:RTInput):Promise<any> {
        const nodeData:NodeData = {
            rtInput : input,
            sender : this.rtSender,
            logger : this.workLogger,
            flowData : this.rtFlowdata,
        }
        const inputNode = new InputNode(0, nodeData, { inputType : 'normal' });
        const promptBuildNode = new PromptBuildNode(1, nodeData, { promptId : 'default', form : {} });
        const stringifyChatMLNode = new StringifyChatMLNode(2, nodeData, {});
        const outputNode = new OutputNode(3, nodeData, {});

        try {
            const { chat, input, form } = await inputNode.run({});
            const {
                promptMessage
            } = await promptBuildNode.run(
                { 
                    input: input,
                },
            );
            const { chatML } = await stringifyChatMLNode.run({ promptMessage });
            await outputNode.run({ output: chatML });
        }
        finally {
            this.rtSender.sendClose();
        }
    }
}

export default RTWorkflowPromptOnly;
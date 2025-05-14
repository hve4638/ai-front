import { InputNode, OutputNode, PromptBuildNode } from '../nodes';
import { StringifyChatMLNode } from '../nodes';
import RTWorkflow from './RTWorkflow';

class RTWorkflowPromptOnly extends RTWorkflow {
    async process(rtInput:RTInput):Promise<any> {
        const nodeData = this.getNodeData(rtInput);

        const inputNode = new InputNode(0, nodeData, { inputType : 'normal' });
        const promptBuildNode = new PromptBuildNode(1, nodeData, { promptId : 'default', form : {} });
        const stringifyChatMLNode = new StringifyChatMLNode(2, nodeData, {});
        const outputNode = new OutputNode(3, nodeData, {});

        try {
            const { input } = await inputNode.run({});
            const { promptMessage } = await promptBuildNode.run({ input: input });
            const { chatML } = await stringifyChatMLNode.run({ promptMessage });
            await outputNode.run({ output: chatML });
        }
        finally {
            console.info('Workflow finished');
            this.rtSender.sendClose();
        }
        
        try {
            const { historyRequired } = nodeData;
            if (this.isHistoryReady(historyRequired)) {
                const ac = await this.profile.accessAsHistory(historyRequired.session_id);
                
                ac.addHistory(historyRequired);
            }
        }
        catch (error) {
            console.error('Error while saving history:', error);
        }
    }
}

export default RTWorkflowPromptOnly;
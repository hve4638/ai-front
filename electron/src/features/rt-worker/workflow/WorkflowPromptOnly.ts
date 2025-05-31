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

        const historyAC = await this.profile.accessAsHistory(nodeData.sessionId);

        let input:string;
        try {
            const inputNodeResult = await inputNode.run({});

            input = inputNodeResult.input;
        }
        catch (error) {
            console.error('Error while getting input:', error);
            this.rtSender.sendClose();
            return;
        }

        const historyId = historyAC.addHistory({
            form: nodeData.form,
            create_at: nodeData.create_at,
            
            rt_id: nodeData.rtId,
            rt_uuid: 'unkwown',
            model_id: nodeData.modelId,
        });

        if (nodeData.data.input.length > 0) {
            historyAC.addHistoryMessage(historyId, 'in', nodeData.data.input);
        }
        this.rtSender.sendHistoryUpdate();

        try {
            const { promptMessage } = await promptBuildNode.run({ input });
            const { chatML } = await stringifyChatMLNode.run({ promptMessage });
            await outputNode.run({ output: chatML });
            console.info('Workflow finished');

            await new Promise(resolve => setTimeout(resolve, 1000));
            console.info('Workflow finished after delay');

            if (nodeData.data.output.length > 0) {
                historyAC.addHistoryMessage(historyId, 'out', nodeData.data.output);
                this.rtSender.sendHistoryUpdate();
            }
        }
        finally {
            historyAC.completeHistory(historyId);

            this.rtSender.sendClose();
        }
    }
}

export default RTWorkflowPromptOnly;
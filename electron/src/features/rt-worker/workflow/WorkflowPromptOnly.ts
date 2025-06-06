import { InputNode, OutputNode, PromptBuildNode, StringifyChatMLNode, ChatAIFetchNode } from '../nodes';
import { WorkNodeStop } from '../nodes/errors';
import RTWorkflow from './RTWorkflow';

class RTWorkflowPromptOnly extends RTWorkflow {
    async process(rtInput: RTInput): Promise<any> {
        const nodeData = await this.getNodeData(rtInput);

        const inputNode = new InputNode(0, nodeData, { inputType: 'normal' });
        const promptBuildNode = new PromptBuildNode(1, nodeData, { promptId: 'default', form: {} });
        const chatAIFetchNode = new ChatAIFetchNode(1, nodeData, {});
        const stringifyChatMLNode = new StringifyChatMLNode(2, nodeData, {});
        const outputNode = new OutputNode(3, nodeData, {});

        const historyAC = await this.profile.accessAsHistory(nodeData.sessionId);

        let input: string;
        try {
            const inputNodeResult = await inputNode.run({});

            input = inputNodeResult.input;
        }
        catch (error) {
            console.error('Error while getting input:', error);
            if (error instanceof WorkNodeStop) {
                this.rtSender.sendNoResult();    
            }
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
            const { messages } = await promptBuildNode.run({ input });
            // const { chatML } = await stringifyChatMLNode.run({ messages });
            const { result } = await chatAIFetchNode.run({ messages });
            await outputNode.run({ output: result });

            if (nodeData.data.output.length > 0) {
                historyAC.addHistoryMessage(historyId, 'out', nodeData.data.output);
                this.rtSender.sendHistoryUpdate();
            }
        }
        catch (error) {
            if (error instanceof WorkNodeStop) {
                this.rtSender.sendNoResult();    
            }
        }
        finally {
            historyAC.completeHistory(historyId);

            this.rtSender.sendClose();
        }
    }
}

export default RTWorkflowPromptOnly;
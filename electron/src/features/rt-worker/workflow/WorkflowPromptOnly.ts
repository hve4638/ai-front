import runtime from '@/runtime';
import { InputNode, OutputNode, PromptBuildNode, StringifyChatMLNode, ChatAIFetchNode } from '../nodes';
import { WorkNodeStop } from '../nodes/errors';
import RTWorkflow from './RTWorkflow';
import { UserInput } from '../nodes/types';

class RTWorkflowPromptOnly extends RTWorkflow {
    async process(rtInput: RTInput): Promise<any> {
        const nodeData = await this.getNodeData(rtInput);

        const inputNode = new InputNode(0, nodeData, { inputType: 'normal' });
        const promptBuildNode = new PromptBuildNode(1, nodeData, { promptId: 'default', form: {} });
        const chatAIFetchNode = new ChatAIFetchNode(2, nodeData, { usePromptSetting: true, promptId: 'default' });
        const outputNode = new OutputNode(3, nodeData, {});

        const historyAC = await this.profile.accessAsHistory(nodeData.sessionId);

        let input: UserInput;
        try {
            const inputNodeResult = await inputNode.run({});

            input = inputNodeResult.input;
        }
        catch (error) {
            console.error('Error while getting input:', error);
            if (error instanceof WorkNodeStop) {
                this.rtSender.sendNoResult();    
            }
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
            const { result } = await chatAIFetchNode.run({ messages });
            await outputNode.run({ output: result });

            if (nodeData.data.output.length > 0) {
                historyAC.addHistoryMessage(historyId, 'out', nodeData.data.output);
                // const session = this.profile.session(nodeData.sessionId);
                // await session.setOne('cache.json', 'last_history', {} as HistoryMetadata);
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
        }
    }
}

export default RTWorkflowPromptOnly;
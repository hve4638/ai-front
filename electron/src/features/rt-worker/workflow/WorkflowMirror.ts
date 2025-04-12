import { NodeData, OutputNode } from '../nodes';
import RTWorkflow from './RTWorkflow';

class WorkflowMirror extends RTWorkflow {
    async process(input:RTInput) {
        const nodeData:NodeData = {
            rtInput : input,
            sender : this.rtSender,
            logger : this.workLogger,
            flowData : this.rtFlowdata,
        }
        this.workLogger.workBegin();
        
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            // const outputNode = new OutputNode(-1, nodeData);
            this.rtSender.sendResult(input.message.at(-1)?.message[0].value ?? 'EMPTY');
        }
        catch (error) {
            this.rtSender.sendError(`Error: ${error}`);
        }
        finally {
            this.rtSender.sendClose();
        }
    }
}

export default WorkflowMirror;
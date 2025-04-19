import { NodeData, OutputNode } from '../nodes';
import RTWorkflow from './RTWorkflow';

class WorkflowMirror extends RTWorkflow {
    async process(rtInput:RTInput) {
        const nodeData = this.getNodeData(rtInput);
        this.workLogger.workBegin();
        
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            this.rtSender.sendResult(rtInput.input);
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
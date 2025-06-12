import { NodeData, OutputNode } from '../nodes';
import RTWorkflow from './RTWorkflow';

class WorkflowMirror extends RTWorkflow {
    async process(rtInput:RTInput) {
        this.workLogger.workBegin();
        
        try {
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
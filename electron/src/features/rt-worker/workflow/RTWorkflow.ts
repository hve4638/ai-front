import WorkLogger from '../WorkLog';
import RTSender from '../RTSender';
import { GlobalRTFlowData, WorkLog } from '../types';
import { NodeData } from '../nodes';

abstract class RTWorkflow {
    protected workLogger:WorkLogger = new WorkLogger();

    constructor(
        protected rtSender:RTSender,
        protected rtFlowdata:GlobalRTFlowData,
    ) {
        
    }

    abstract process(input:RTInput, workLog:WorkLog[]):Promise<any>;
}

export default RTWorkflow;
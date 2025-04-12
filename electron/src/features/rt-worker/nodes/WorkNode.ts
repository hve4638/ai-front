import RTSender from '../RTSender';
import { GlobalRTFlowData, WorkLog } from '../types';
import WorkLogger from '../WorkLog';

export type NodeData = {
    rtInput:RTInput;
    sender:RTSender;
    logger:WorkLogger;
    flowData:GlobalRTFlowData;
}

abstract class WorkNode<NInput, NOutput, NOption extends object> {
    protected _nodeId:number;
    
    constructor(nodeId:number, protected nodeData:NodeData, protected option:NOption) {
        this._nodeId = nodeId;
    }

    protected get nodeId() {
        return this._nodeId;
    }
    
    async run(input: NInput):Promise<NOutput> {
        // workLog.push({ type : 'node_begin', nodeId : this.nodeId });
        try {
            return this.process(input);
        }
        finally {
            // workLog.push({ type : 'node_end', nodeId : this.nodeId });
        }
    }

    protected abstract process(input: NInput):Promise<NOutput>;
}

export default WorkNode;
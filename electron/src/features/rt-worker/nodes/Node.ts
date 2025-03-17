import { GlobalNodeOption, WorkLog } from '../types'

abstract class WorkNode<NodeInput, NodeOutput, NodeOption={}> {
    #nodeId:number;
    constructor(nodeId:number) {
        this.#nodeId = nodeId;
    }

    protected get nodeId() {
        return this.#nodeId;
    }
    
    async run(input: NodeInput, option:NodeOption, globalOption:GlobalNodeOption, workLog: WorkLog[]):Promise<NodeOutput> {
        workLog.push({ type : 'node_begin', nodeId : this.nodeId });
        try {
            return this.process(input, option, globalOption, workLog);
        }
        finally {
            workLog.push({ type : 'node_end', nodeId : this.nodeId });
        }
    }

    protected abstract process(input: NodeInput, option:NodeOption, globalOption:GlobalNodeOption, workLog: WorkLog[]):Promise<NodeOutput>;
}

export default WorkNode;
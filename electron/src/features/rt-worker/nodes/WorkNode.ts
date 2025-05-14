import type { NodeData } from './types';

abstract class WorkNode<NInput, NOutput, NOption extends object> {
    protected _nodeId:number;
    
    constructor(nodeId:number, protected nodeData:NodeData, protected option:NOption) {
        this._nodeId = nodeId;
    }

    protected get nodeId() {
        return this._nodeId;
    }
    
    async run(input: NInput):Promise<NOutput> {
        try {
            return this.process(input);
        }
        catch(error) {
            console.error(`[WorkNode] Error in node ${this.nodeId}:`, error);
            throw error;
        }
        finally {
            
        }
    }

    protected abstract process(input: NInput):Promise<NOutput>;
}

export default WorkNode;
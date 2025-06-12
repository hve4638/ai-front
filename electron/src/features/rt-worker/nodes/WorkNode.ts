import runtime from '@/runtime';
import type { NodeData } from './types';

abstract class WorkNode<NInput, NOutput, NOption extends object> {
    protected _nodeId:number;
    protected name:string = 'Node';
    
    constructor(nodeId:number, protected nodeData:NodeData, protected option:NOption) {
        this._nodeId = nodeId;
    }

    protected get nodeId() {
        return this._nodeId;
    }
    
    async run(input: NInput):Promise<NOutput> {
        try {
            runtime.logger.trace(`Enter ${this.name} (id=${this.nodeId})`);
            return this.process(input);
        }
        catch(error) {
            runtime.logger.error(`Error in '${this.name}' (id=${this.nodeId})`, error);
            throw error;
        }
        finally {
            
        }
    }

    protected abstract process(input: NInput):Promise<NOutput>;
}

export default WorkNode;
import NoLogger from '@/features/nologger';

import type { NodeData } from './types';
import { LevelLogger } from '@/types';

abstract class WorkNode<NInput, NOutput, NOption extends object> {
    protected _nodeId: number;
    protected name: string = 'Node';
    protected logger: LevelLogger;

    constructor(nodeId: number, protected nodeData: NodeData, protected option: NOption, logger?: LevelLogger) {
        this._nodeId = nodeId;
        this.logger = logger ?? NoLogger.instance;
    }

    protected get nodeId() {
        return this._nodeId;
    }

    async run(input: NInput): Promise<NOutput> {
        try {
            this.logger.trace(`Enter ${this.name} (id=${this.nodeId})`);
            return this.process(input);
        }
        catch (error) {
            this.logger.error(`Error in '${this.name}' (id=${this.nodeId})`, error);
            throw error;
        }
        finally {

        }
    }

    protected abstract process(input: NInput): Promise<NOutput>;
}

export default WorkNode;
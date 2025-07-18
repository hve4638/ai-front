import { WorkLog } from './types';

class WorkLogger {
    private log:WorkLog[];

    constructor() {
        this.log = [];
    }

    getLog() {
        return this.log;
    }

    nodeBegin(nodeId:number) {
        this.log.push({ type : 'node_begin', nodeId });
    }

    nodeEnd(nodeId:number) {
        this.log.push({ type : 'node_end', nodeId });
    }

    nodeError(nodeId:number, message:string[]) {
        this.log.push({ type : 'node_error', nodeId, message });
    }

    nodeWarning(nodeId:number, message:string[]) {
        this.log.push({ type : 'node_warning', nodeId, message });
    }

    nodeInfo(nodeId:number, message:string[]) {
        this.log.push({ type : 'node_info', nodeId, message });
    }

    nodeDebug(nodeId:number, message:string[]) {
        this.log.push({ type : 'node_debug', nodeId, message });
    }

    workBegin(message?:string[]) {
        this.log.push({ type : 'work_begin', message });
    }

    workEnd(message?:string[]) {
        this.log.push({ type : 'work_end', message });
    }
}

export default WorkLogger;
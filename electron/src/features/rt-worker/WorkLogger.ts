import { WorkLog } from './types'

class WorkLogger {
    private workLog: WorkLog[] = [];

    constructor() {
        this.workLog = [];
    }

    nodeBegin(nodeId:number) {
        this.workLog.push({ type: 'node_begin', nodeId });
    }

    nodeEnd(nodeId:number) {
        this.workLog.push({ type: 'node_end', nodeId });
    }

    nodeError(nodeId:number, message:string[]) {
        this.workLog.push({ type: 'node_error', nodeId, message });
    }

    nodeWarning(nodeId:number, message:string[]) {
        this.workLog.push({ type: 'node_warning', nodeId, message });
    }

    nodeInfo(nodeId:number, message:string[]) {
        this.workLog.push({ type: 'node_info', nodeId, message });
    }

    nodeDebug(nodeId:number, message:string[]) {
        this.workLog.push({ type: 'node_debug', nodeId, message });
    }

    workBegin() {
        this.workLog.push({ type: 'work_begin' });
    }

    workEnd() {
        this.workLog.push({ type: 'work_end' });
    }
}

export default WorkLogger;
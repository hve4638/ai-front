import RTWorkflow from './RTWorkflow';

class WorkflowMirror extends RTWorkflow {
    async process(rtInput: RTInput) {
        this.workLogger.workBegin();

        try {
            this.rtEventEmitter.emit.output.set(rtInput.input);
        }
        catch (error) {
            if (error instanceof Error) {
                this.rtEventEmitter.emit.error.other([error.message]);
            }
        }
        finally {
            this.rtEventEmitter.emit.directive.close();
        }
    }
}

export default WorkflowMirror;
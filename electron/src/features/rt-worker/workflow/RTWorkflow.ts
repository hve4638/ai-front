import WorkLogger from '../WorkLog';
import RTSender from '../RTSender';
import { WorkLog } from '../types';
import { Profile } from '@/features/profiles';
import { NodeData } from '../nodes/types';
import { HistoryRequired } from '@/features/acstorage-accessor/HistoryAccessor';

abstract class RTWorkflow {
    protected workLogger:WorkLogger = new WorkLogger();

    constructor(
        protected rtSender:RTSender,
        protected profile:Profile,
    ) {
        
    }

    abstract process(input:RTInput, workLog:WorkLog[]):Promise<any>;

    protected getNodeData(rtInput:RTInput):NodeData {
        return {
            sender : this.rtSender,
            logger : this.workLogger,

            input : rtInput.input,
            chat : rtInput.chat ?? [],
            form : rtInput.form,
            modelId : rtInput.modelId,
            rtId : rtInput.rtId,
            profile : this.profile,
            sessionId : rtInput.sessionId,

            historyRequired : {
                fetch_count : 0,
                input : [],
                output : [],
                input_token_count : 0,
                output_token_count : 0,
                create_at : Date.now(),
                session_id : rtInput.sessionId,
                rt_id : rtInput.rtId,
                rt_uuid : rtInput.rtId,
                model_id : rtInput.modelId,

                form : {},
            }
        }
    }

    protected isHistoryReady(historyRequired:HistoryRequired):historyRequired is Required<HistoryRequired> {
        if (
            historyRequired.rt_id &&
            historyRequired.rt_uuid &&
            historyRequired.model_id &&
            historyRequired.session_id &&
            historyRequired.chat_type
        ) {
            return true;
        }
        else {
            return false;
        }
    }
}

export default RTWorkflow;
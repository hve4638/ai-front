import { getEncoding, encodingForModel } from 'js-tiktoken';
import { Profile } from '@/features/profiles';
import { HistoryRequired } from '@/features/acstorage-accessor/HistoryAccessor';
import { HistoryMessageRow } from '@/features/acstorage-accessor/HistoryAccessor/types';


import WorkLogger from '../WorkLog';
import RTSender from '../RTSender';
import { WorkLog } from '../types';
import { NodeData } from '../nodes/types';

abstract class RTWorkflow {
    protected workLogger:WorkLogger = new WorkLogger();

    constructor(
        protected rtSender:RTSender,
        protected profile:Profile,
    ) {
        
    }

    abstract process(input:RTInput, workLog:WorkLog[]):Promise<any>;

    protected getNodeData(rtInput:RTInput):NodeData {
        const input:HistoryMessageRow[] = [];
        input.push({
            type: 'text',
            text: rtInput.input,
            data: null,
            token_count: 0,
        });

        return {
            sender : this.rtSender,
            logger : this.workLogger,
            profile : this.profile,

            chat : rtInput.chat ?? [],
            form : rtInput.form,
            
            sessionId : rtInput.sessionId,
            modelId : rtInput.modelId,
            rtId : rtInput.rtId,
            create_at : Date.now(),

            data : {
                input: input,
                output: [],
                input_token_count: 0,
                output_token_count: 0,
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
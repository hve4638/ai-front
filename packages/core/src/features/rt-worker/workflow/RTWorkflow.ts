import { getEncoding, encodingForModel } from 'js-tiktoken';
import { Profile } from '@/features/profiles';
import { HistoryRequired } from '@/features/acstorage-accessor/HistoryAccessor';
import { HistoryMessageRow, HistoryRow } from '@/features/acstorage-accessor/HistoryAccessor/types';

import WorkLogger from '../WorkLog';
import RTEventEmitter from '../RTEventEmitter';
import { WorkLog } from '../types';
import { NodeData } from '../nodes/types';

abstract class RTWorkflow {
    protected workLogger: WorkLogger = new WorkLogger();

    constructor(
        protected rtEventEmitter: RTEventEmitter,
        protected profile: Profile,
    ) {

    }

    abstract process(input: RTInput, workLog: WorkLog[]): Promise<any>;

    protected async getNodeData(rtInput: RTInput): Promise<NodeData> {
        const historyAC = await this.profile.accessAsHistory(rtInput.sessionId);
        const chat = historyAC
            .getHistory(0, 1000, true)
            .map((row: HistoryRow) => row.id)
            .reverse()
            .map((id: number) => historyAC.getMessageText(id))
            .flatMap(({ input, output }) => {
                const result: {
                    role: 'user' | 'assistant',
                    contents: { type: 'text', value: string }[]
                }[] = [];

                if (input) result.push({ role: 'user', contents: [{ type: 'text', value: input }] });
                if (output) result.push({ role: 'assistant', contents: [{ type: 'text', value: output }] });
                return result;
            });

        return {
            rtEventEmitter: this.rtEventEmitter,
            logger: this.workLogger,
            profile: this.profile,

            inputText: rtInput.input,
            inputFiles: rtInput.inputFiles,

            chat: chat,
            form: rtInput.form,

            sessionId: rtInput.sessionId,
            modelId: rtInput.modelId,
            rtId: rtInput.rtId,
            create_at: Date.now(),

            data: {
                input: [],
                output: [],
                input_token_count: 0,
                output_token_count: 0,
            }
        }
    }

    protected isHistoryReady(historyRequired: HistoryRequired): historyRequired is Required<HistoryRequired> {
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
import { type Profile } from '@/features/profiles';
import RTSender from '../RTSender';
import WorkLogger from '../WorkLog';
import { HistoryRequired } from '@/features/acstorage-accessor/HistoryAccessor';
import { HistoryMessageRow } from '@/features/acstorage-accessor/HistoryAccessor/types';

export type NodeData = {
    sender: RTSender;
    logger: WorkLogger;
    profile: Profile;

    chat: ChatContents[];
    form: Record<string, any>;

    sessionId: string;
    modelId: string;
    rtId: string;
    create_at: number;

    data: {
        input: HistoryMessageRow[];
        output: HistoryMessageRow[];
        input_token_count: number;
        output_token_count: number;
    };
}

export type ChatContents = {
    role: 'user' | 'assistant';
    contents: {
        type: 'text',
        value: string
    }[]
}
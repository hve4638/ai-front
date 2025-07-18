import { type Profile } from '@/features/profiles';
import { HistoryMessageRow } from '@/features/acstorage-accessor';

import WorkLogger from '../WorkLog';
import RTEventEmitter from '../RTEventEmitter';

export type NodeData = {
    rtEventEmitter: RTEventEmitter;
    logger: WorkLogger;
    profile: Profile;

    inputText: string;
    inputFiles: InputFile[];

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

export interface UserInput {
    text: string;
    files: InputFile[];
}
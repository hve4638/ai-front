import { type Profile } from '@/features/profiles';
import RTSender from '../RTSender';
import WorkLogger from '../WorkLog';
import { HistoryRequired } from '@/features/acstorage-accessor/HistoryAccessor';

export type NodeData = {
    rtInput:RTInput;
    sender:RTSender;
    logger:WorkLogger;
    rtId: string;
    modelId: string;
    profile: Profile;
    sessionId: string|undefined;
    historyRequired: HistoryRequired;
}

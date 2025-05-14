import { type Profile } from '@/features/profiles';
import RTSender from '../RTSender';
import WorkLogger from '../WorkLog';
import { HistoryRequired } from '@/features/acstorage-accessor/HistoryAccessor';

export type NodeData = {
    sender:RTSender;
    logger:WorkLogger;

    profile: Profile;
    historyRequired: HistoryRequired;
    
    input: string;
    chat : RTInputMessage[];
    form: Record<string, any>;
    modelId: string;
    rtId: string;
    sessionId: string|undefined;
}

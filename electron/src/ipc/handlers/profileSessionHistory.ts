import {
    profiles,
} from '@ipc/registry';
import { IPCInvokerName } from 'types';

function handler() {
    const throttles = {};

    return {
        /* 프로필 세션 히스토리 */
        [IPCInvokerName.GetProfileSessionHistory]: async (profileId: string, sessionId: string, condition: HistoryCondition) => {
            const profile = profiles.getProfile(profileId);
            const accessor = profile.getHistoryAccessor(sessionId);

            const {
                offset = 0,
                limit = 10,
                date_begin,
                date_end,
                desc,
                flag,
            } = condition;

            return [null, accessor.get(offset, limit)] as const;
        },
        [IPCInvokerName.AddProfileSessionHistory]: async (profileId: string, sessionId: string, history: any) => {
            const profile = profiles.getProfile(profileId);
            const accessor = profile.getHistoryAccessor(sessionId);

            //accessor.add(history);

            return [null] as const;
        },
        [IPCInvokerName.DeleteProfileSessionHistory]: async (profileId: string, sessionId: string, historyKey: number) => {
            const profile = profiles.getProfile(profileId);
            const accessor = profile.getHistoryAccessor(sessionId);

            accessor.delete(historyKey);

            return [null] as const;
        },
        [IPCInvokerName.DeleteAllProfileSessionHistory]: async (profileId: string, sessionId: string) => {
            const profile = profiles.getProfile(profileId);
            const accessor = profile.getHistoryAccessor(sessionId);

            accessor.deleteAll();

            return [null] as const;
        },
    }
}

export default handler;
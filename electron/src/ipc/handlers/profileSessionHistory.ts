import {
    profiles,
} from '@ipc/registry';
import { IPCCommand } from '@types';

function handler() {
    const throttles = {};

    return {
        /* 프로필 세션 히스토리 */
        [IPCCommand.GetProfileSessionHistory]: async (profileId: string, sessionId: string, condition: HistoryCondition) => {
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
        [IPCCommand.AddProfileSessionHistory]: async (profileId: string, sessionId: string, history: any) => {
            const profile = profiles.getProfile(profileId);
            const accessor = profile.getHistoryAccessor(sessionId);

            //accessor.add(history);

            return [null] as const;
        },
        [IPCCommand.DeleteProfileSessionHistory]: async (profileId: string, sessionId: string, historyKey: number) => {
            const profile = profiles.getProfile(profileId);
            const accessor = profile.getHistoryAccessor(sessionId);

            accessor.delete(historyKey);

            return [null] as const;
        },
        [IPCCommand.DeleteAllProfileSessionHistory]: async (profileId: string, sessionId: string) => {
            const profile = profiles.getProfile(profileId);
            const accessor = profile.getHistoryAccessor(sessionId);

            accessor.deleteAll();

            return [null] as const;
        },
    }
}

export default handler;
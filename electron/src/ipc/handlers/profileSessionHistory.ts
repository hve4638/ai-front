import * as utils from '@utils';
import ChatAIModels from '@features/chatai-models';
import PING from '@ipc/ipcping';

import {
    profiles,
} from '@ipc/registry';
import Profile from '@features/profiles/Profile';

function handler() {
    const throttles = {};

    return {
        /* 프로필 세션 히스토리 */
        [PING.GET_PROFILE_SESSION_HISTORY]: async (profileId: string, sessionId: string, condition: HistoryCondition) => {
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
        [PING.ADD_PROFILE_SESSION_HISTORY]: async (profileId: string, sessionId: string, history: any) => {
            const profile = profiles.getProfile(profileId);
            const accessor = profile.getHistoryAccessor(sessionId);

            //accessor.add(history);

            return [null] as const;
        },
        [PING.DELETE_PROFILE_SESSION_HISTORY]: async (profileId: string, sessionId: string, historyKey: number) => {
            const profile = profiles.getProfile(profileId);
            const accessor = profile.getHistoryAccessor(sessionId);

            accessor.delete(historyKey);

            return [null] as const;
        },
        [PING.DELETE_ALL_PROFILE_SESSION_HISTORY]: async (profileId: string, sessionId: string) => {
            const profile = profiles.getProfile(profileId);
            const accessor = profile.getHistoryAccessor(sessionId);

            accessor.deleteAll();

            return [null] as const;
        },
    }
}

export default handler;
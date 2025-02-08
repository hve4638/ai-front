import * as utils from '@utils';
import ChatAIModels from '@features/chatai-models';
import PING from '@ipc/ipcping';

import {
    profiles,
} from '@ipc/registry';
import Profile from '@features/profiles/Profile';

function handler() {
    const throttles = {};

    const saveProfile = (profile:Profile) => {
        const throttleId = `profile_${profile.path}`;
        throttles[throttleId] ??= utils.throttle(500);
        throttles[throttleId](()=>{
            profile.commit();
        });
    }

    return {
        /* 프로필 세션 */
        [PING.ADD_PROFILE_SESSION]: async (profileId: string) => {
            const profile = profiles.getProfile(profileId);
            const sid = profile.createSession();

            saveProfile(profile);
            return [null, sid] as const;
        },
        [PING.REMOVE_PROFILE_SESSION]: async (profileId: string, sessionId: string) => {
            const profile = profiles.getProfile(profileId);
            profile.removeSession(sessionId);

            const throttleId = `profile_${profileId}`;
            throttles[throttleId] ??= utils.throttle(500);
            throttles[throttleId](() => {
                profile.commit();
            });

            return [null] as const;
        },
        [PING.UNDO_REMOVE_PROFILE_SESSION]: async (profileId: string) => {
            const profile = profiles.getProfile(profileId);
            const sid = profile.undoRemoveSession();

            const throttleId = `profile_${profileId}`;
            throttles[throttleId] ??= utils.throttle(500);
            throttles[throttleId](() => {
                profile.commit();
            });

            if (sid == null) {
                return [new Error('No session to undo')] as const;
            }
            else {
                return [null, sid] as const;
            }
        },
        [PING.REORDER_PROFILE_SESSIONS]: async (profileId: string, newTabs: string[]) => {
            const profile = profiles.getProfile(profileId);
            profile.reorderSessions(newTabs);

            const throttleId = `profile_${profileId}`;
            throttles[throttleId] ??= utils.throttle(500);
            throttles[throttleId](() => {
                profile.commit();
            });

            return [null] as const;
        },
        [PING.GET_PROFILE_SESSION_IDS]: async (profileId: string) => {
            const profile = profiles.getProfile(profileId);
            const sessions = profile.getSessionIds();

            return [null, sessions] as const;
        },

        /* 프로필 세션 저장소 */
        [PING.GET_PROFILE_SESSION_DATA]: async (profileId: string, sessionId: string, id: string, key: string) => {
            const profile = profiles.getProfile(profileId);
            const accessor = profile.getJSONAccessor(`session:${sessionId}:${id}`);

            return [null, accessor.get(key)] as const;
        },
        [PING.SET_PROFILE_SESSION_DATA]: async (profileId: string, sessionId: string, accessId: string, key: string, value: any) => {
            const profile = profiles.getProfile(profileId);
            const accessor = profile.getJSONAccessor(`session:${sessionId}:${accessId}`);

            accessor.set(key, value);
            throttles['profiles'] ??= utils.throttle(500);
            throttles['profiles'](() => {
                profiles.saveAll();
            });

            return [null] as const;
        },

        /* 프로필 세션 히스토리 */
        getProfileSessionHistory: async (profileId: string, sessionId: string, condition: HistoryCondition) => {
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
        addProfileSessionHistory: async (profileId: string, sessionId: string, history: any) => {
            const profile = profiles.getProfile(profileId);
            const accessor = profile.getHistoryAccessor(sessionId);

            //accessor.add(history);

            return [null] as const;
        },
        deleteProfileSessionHistory: async (profileId: string, sessionId: string, historyKey: number) => {
            const profile = profiles.getProfile(profileId);
            const accessor = profile.getHistoryAccessor(sessionId);

            accessor.delete(historyKey);

            return [null] as const;
        },
        deleteAllProfileSessionHistory: async (profileId: string, sessionId: string) => {
            const profile = profiles.getProfile(profileId);
            const accessor = profile.getHistoryAccessor(sessionId);

            accessor.deleteAll();

            return [null] as const;
        },
    }
}

export default handler;
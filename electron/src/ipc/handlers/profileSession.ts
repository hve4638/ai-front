import * as utils from '@utils';
import { IPCCommand } from 'types';

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
        [IPCCommand.AddProfileSession]: async (profileId: string) => {
            const profile = profiles.getProfile(profileId);
            const sid = profile.createSession();

            saveProfile(profile);
            return [null, sid] as const;
        },
        [IPCCommand.RemoveProfileSession]: async (profileId: string, sessionId: string) => {
            const profile = profiles.getProfile(profileId);
            profile.removeSession(sessionId);

            const throttleId = `profile_${profileId}`;
            throttles[throttleId] ??= utils.throttle(500);
            throttles[throttleId](() => {
                profile.commit();
            });

            return [null] as const;
        },
        [IPCCommand.UndoRemoveProfileSession]: async (profileId: string) => {
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
        [IPCCommand.ReorderProfileSessions]: async (profileId: string, newTabs: string[]) => {
            const profile = profiles.getProfile(profileId);
            profile.reorderSessions(newTabs);

            const throttleId = `profile_${profileId}`;
            throttles[throttleId] ??= utils.throttle(500);
            throttles[throttleId](() => {
                profile.commit();
            });

            return [null] as const;
        },
        [IPCCommand.GetProfileSessionIds]: async (profileId: string) => {
            const profile = profiles.getProfile(profileId);
            const sessions = profile.getSessionIds();

            return [null, sessions] as const;
        },

        /* 프로필 세션 저장소 */
        [IPCCommand.GetProfileSessionData]: async (profileId: string, sessionId: string, id: string, keys: string[]) => {
            const profile = profiles.getProfile(profileId);
            const accessor = profile.getJSONAccessor(`session:${sessionId}:${id}`);
            
            return [null, accessor.get(keys)] as const;
        },
        [IPCCommand.SetProfileSessionData]: async (profileId: string, sessionId: string, accessId: string, data:KeyValueInput) => {
            const profile = profiles.getProfile(profileId);
            const accessor = profile.getJSONAccessor(`session:${sessionId}:${accessId}`);

            accessor.set(data);
            throttles['profiles'] ??= utils.throttle(500);
            throttles['profiles'](() => {
                profiles.saveAll();
            });

            return [null] as const;
        },
    }
}

export default handler;
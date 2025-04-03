import * as utils from '@utils';
import { IPCInvokerName } from 'types';

import {
    profiles,
} from '@/registry';
import Profile from '@/features/profiles/Profile';

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
        [IPCInvokerName.AddProfileSession]: async (profileId: string) => {
            const profile = await profiles.getProfile(profileId);
            const sid = await profile.createSession();

            saveProfile(profile);
            return [null, sid] as const;
        },
        [IPCInvokerName.RemoveProfileSession]: async (profileId: string, sessionId: string) => {
            const profile = await profiles.getProfile(profileId);
            await profile.removeSession(sessionId);

            saveProfile(profile);

            return [null] as const;
        },
        [IPCInvokerName.UndoRemoveProfileSession]: async (profileId: string) => {
            const profile = await profiles.getProfile(profileId);
            const sid = await profile.undoRemoveSession();

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
        [IPCInvokerName.ReorderProfileSessions]: async (profileId: string, newTabs: string[]) => {
            const profile = await profiles.getProfile(profileId);
            profile.reorderSessions(newTabs);

            const throttleId = `profile_${profileId}`;
            throttles[throttleId] ??= utils.throttle(500);
            throttles[throttleId](() => {
                profile.commit();
            });

            return [null] as const;
        },
        [IPCInvokerName.GetProfileSessionIds]: async (profileId: string) => {
            const profile = await profiles.getProfile(profileId);
            const sessions = await profile.getSessionIds();

            return [null, sessions] as const;
        },

        /* 프로필 세션 저장소 */
        [IPCInvokerName.GetProfileSessionData]: async (profileId: string, sessionId: string, id: string, keys: string[]) => {
            const profile = await profiles.getProfile(profileId);
            const accessor = await profile.accessAsJSON(`session:${sessionId}:${id}`);
            
            return [null, accessor.get(...keys)] as const;
        },
        [IPCInvokerName.SetProfileSessionData]: async (profileId: string, sessionId: string, accessId: string, data:KeyValueInput) => {
            const profile = await profiles.getProfile(profileId);
            const accessor = await profile.accessAsJSON(`session:${sessionId}:${accessId}`);

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
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
        /* 프로필 */
        [PING.CREATE_PROFILE]: async () => {
            const identifier = profiles.createProfile();

            throttles['profiles'] ??= utils.throttle(500);
            throttles['profiles'](() => {
                profiles.saveAll();
            });

            return [null, identifier] as const;
        },
        [PING.DELETE_PROFILE]: async (profileName: string) => {
            profiles.deleteProfile(profileName);
            return [null] as const;
        },

        /* 프로필 목록 */
        [PING.GET_PROFILE_LIST]: async () => {
            const ids = profiles.getProfileIDs();

            return [null, ids] as const;
        },
        [PING.GET_LAST_PROFILE]: async () => {
            const ids = profiles.getLastProfileId();

            return [null, ids] as const;
        },
        [PING.SET_LAST_PROFILE]: async (id: string | null) => {
            profiles.setLastProfileId(id);

            return [null] as const;
        },

        /* 프로필 저장소 */
        [PING.GET_PROFILE_DATA]: async (profileId: string, id: string, key: string) => {
            const profile = profiles.getProfile(profileId);
            const accessor = profile.getJSONAccessor(id);
            return [null, accessor.get(key)] as const;
        },
        [PING.SET_PROFILE_DATA]: async (profileId: string, id: string, key: string, value: any) => {
            const profile = profiles.getProfile(profileId);
            const accessor = profile.getJSONAccessor(id);
            accessor.set(key, value);

            throttles[profileId] ??= utils.throttle(500);

            // 500ms throttle로 저장
            throttles[profileId](() => {
                profile.commit();
            });

            return [null] as const;
        },
        [PING.GET_PROFILE_DATA_AS_TEXT]: async (profileId: string, id: string) => {
            const profile = profiles.getProfile(profileId);
            const accessor = profile.getTextAccessor(id);
            return [null, accessor.read()] as const;
        },
        [PING.SET_PROFILE_DATA_AS_TEXT]: async (profileId: string, id: string, value: any) => {
            const profile = profiles.getProfile(profileId);
            const accessor = profile.getTextAccessor(id);
            accessor.write(value);

            return [null] as const;
        },
        [PING.GET_PROFILE_DATA_AS_BINARY]: async (profileId: string, id: string) => {
            const profile = profiles.getProfile(profileId);
            const accessor = profile.getBinaryAccessor(id);
            return [null, accessor.read()] as const;
        },
        [PING.SET_PROFILE_DATA_AS_BINARY]: async (profileId: string, id: string, content: Buffer) => {
            const profile = profiles.getProfile(profileId);
            const accessor = profile.getBinaryAccessor(id);
            accessor.write(content);

            return [null] as const;
        },
    }
}

export default handler;
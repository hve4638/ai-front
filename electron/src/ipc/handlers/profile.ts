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
        /* 프로필 */
        [IPCCommand.CreateProfile]: async () => {
            const identifier = profiles.createProfile();

            throttles['profiles'] ??= utils.throttle(500);
            throttles['profiles'](() => {
                profiles.saveAll();
            });

            return [null, identifier] as const;
        },
        [IPCCommand.DeleteProfile]: async (profileName: string) => {
            profiles.deleteProfile(profileName);
            return [null] as const;
        },

        /* 프로필 목록 */
        [IPCCommand.GetProfileList]: async () => {
            const ids = profiles.getProfileIDs();

            return [null, ids] as const;
        },
        [IPCCommand.GetLastProfile]: async () => {
            const ids = profiles.getLastProfileId();

            return [null, ids] as const;
        },
        [IPCCommand.SetLastProfile]: async (id: string | null) => {
            profiles.setLastProfileId(id);

            return [null] as const;
        },

        /* 프로필 저장소 */
        [IPCCommand.GetProfileData]: async (profileId: string, id: string, keys: string[]) => {
            const profile = profiles.getProfile(profileId);
            const accessor = profile.getJSONAccessor(id);
            return [null, accessor.get(keys)] as const;
        },
        [IPCCommand.SetProfileData]: async (profileId: string, id: string, data: KeyValueInput) => {
            const profile = profiles.getProfile(profileId);
            const accessor = profile.getJSONAccessor(id);
            accessor.set(data);

            throttles[profileId] ??= utils.throttle(500);

            // 500ms throttle로 저장
            throttles[profileId](() => {
                profile.commit();
            });

            return [null] as const;
        },
        [IPCCommand.GetProfileDataAsText]: async (profileId: string, id: string) => {
            const profile = profiles.getProfile(profileId);
            const accessor = profile.getTextAccessor(id);
            return [null, accessor.read()] as const;
        },
        [IPCCommand.SetProfileDataAsText]: async (profileId: string, id: string, value: any) => {
            const profile = profiles.getProfile(profileId);
            const accessor = profile.getTextAccessor(id);
            accessor.write(value);

            return [null] as const;
        },
        [IPCCommand.GetProfileDataAsBinary]: async (profileId: string, id: string) => {
            const profile = profiles.getProfile(profileId);
            const accessor = profile.getBinaryAccessor(id);
            return [null, accessor.read()] as const;
        },
        [IPCCommand.SetProfileDataAsBinary]: async (profileId: string, id: string, content: Buffer) => {
            const profile = profiles.getProfile(profileId);
            const accessor = profile.getBinaryAccessor(id);
            accessor.write(content);

            return [null] as const;
        },
    }
}

export default handler;
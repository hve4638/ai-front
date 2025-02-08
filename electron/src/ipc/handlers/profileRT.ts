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
        /* 프로필 RT */
        [PING.GET_PROFILE_RT_TREE]: async (profileId: string) => {
            const profile = profiles.getProfile(profileId);
            const tree = profile.getRTTree();

            return [null, tree] as const;
        },
        [PING.UPDATE_PROFILE_RT_TREE]: async (profileId: string, tree: any) => {
            const profile = profiles.getProfile(profileId);
            profile.updateRTTree(tree);
            saveProfile(profile);

            return [null] as const;
        },
        [PING.ADD_PROFILE_RT]: async (profileId: string, metadata: RTMetadata) => {
            const profile = profiles.getProfile(profileId);
            profile.addRT(metadata);
            saveProfile(profile);

            return [null] as const;
        },
        [PING.REMOVE_PROFILE_RT]: async (profileId: string, promptId: string) => {
            const profile = profiles.getProfile(profileId);
            profile.removeRT(promptId);
            saveProfile(profile);

            return [null] as const;
        },
        [PING.GET_PROFILE_RT_MODE]: async (profileId: string, rtId: string) => {
            const profile = profiles.getProfile(profileId);
            const mode = profile.getRTMode(rtId);

            return [null, mode] as const;
        },
        [PING.SET_PROFILE_RT_MODE]: async (profileId: string, rtId: string, mode: RTMode) => {
            const profile = profiles.getProfile(profileId);
            profile.setRTMode(rtId, mode);
            saveProfile(profile);

            return [null] as const;
        },
        [PING.GET_PROFILE_RT_SIMPLE_MODE_DATA]: async (profileId: string, rtId: string) => {
            const profile = profiles.getProfile(profileId);
            const data = profile.getRTSimpleModeData(rtId);

            return [null, data] as const;
        },
        [PING.SET_PROFILE_RT_SIMPLE_MODE_DATA]: async (profileId: string, data:RTSimpleModeData) => {
            const profile = profiles.getProfile(profileId);
            profile.setRTSimpleModeData(data);

            return [null] as const;
        },
        [PING.HAS_PROFILE_RT_ID]: async (profileId: string, rtId: string) => {
            const profile = profiles.getProfile(profileId);
            const exists = profile.hasRTId(rtId);

            return [null, exists] as const;
        },
        [PING.GENERATE_PROFILE_RT_ID]: async (profileId: string) => {
            const profile = profiles.getProfile(profileId);
            const rtId = profile.generateRTId();

            return [null, rtId] as const;
        },
        [PING.CHANGE_PROFILE_RT_ID]: async (profileId: string, oldRTId: string, newRTId: string) => {
            const profile = profiles.getProfile(profileId);
            profile.changeRTId(oldRTId, newRTId);
            saveProfile(profile);

            return [null] as const;
        },
    }
}

export default handler;
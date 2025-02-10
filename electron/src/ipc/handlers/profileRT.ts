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
        /*  */
        [IPCCommand.GenerateProfileRTId]: async (profileId: string) => {
            const profile = profiles.getProfile(profileId);
            const rtId = profile.generateRTId();

            return [null, rtId] as const;
        },

        /* 트리 */
        [IPCCommand.GetProfileRTTree]: async (profileId: string) => {
            const profile = profiles.getProfile(profileId);
            const tree = profile.getRTTree();

            return [null, tree] as const;
        },
        [IPCCommand.UpdateProfileRTTree]: async (profileId: string, tree: any) => {
            const profile = profiles.getProfile(profileId);
            profile.updateRTTree(tree);
            saveProfile(profile);

            return [null] as const;
        },

        /* RT 컨트롤 */
        [IPCCommand.AddProfileRT]: async (profileId: string, metadata: RTMetadata) => {
            const profile = profiles.getProfile(profileId);
            profile.addRT(metadata);
            saveProfile(profile);

            return [null] as const;
        },
        [IPCCommand.RemoveProfileRT]: async (profileId: string, promptId: string) => {
            const profile = profiles.getProfile(profileId);
            profile.removeRT(promptId);
            saveProfile(profile);
            
            return [null] as const;
        },

        /* RT 모드 */
        [IPCCommand.GetProfileRTMode]: async (profileId: string, rtId: string) => {
            const profile = profiles.getProfile(profileId);
            const mode = profile.getRTMode(rtId);

            return [null, mode] as const;
        },
        [IPCCommand.SetProfileRTMode]: async (profileId: string, rtId: string, mode: RTMode) => {
            const profile = profiles.getProfile(profileId);
            profile.setRTMode(rtId, mode);
            saveProfile(profile);

            return [null] as const;
        },

        
        [IPCCommand.GetProfileRTPromptData]: async (profileId: string, rtId: string, promptId:string) => {
            const profile = profiles.getProfile(profileId);
            const data = profile.getRTPromptData(rtId, promptId);

            return [null, data] as const;
        },
        [IPCCommand.SetProfileRTPromptData]: async (profileId: string, data:RTPromptData) => {
            const profile = profiles.getProfile(profileId);
            profile.setRTPromptData(data);

            return [null] as const;
        },

        [IPCCommand.HasProfileRTId]: async (profileId: string, rtId: string) => {
            const profile = profiles.getProfile(profileId);
            const exists = profile.hasRTId(rtId);

            return [null, exists] as const;
        },
        [IPCCommand.ChangeProfileRTId]: async (profileId: string, oldRTId: string, newRTId: string) => {
            const profile = profiles.getProfile(profileId);
            profile.changeRTId(oldRTId, newRTId);
            saveProfile(profile);

            return [null] as const;
        },
    }
}

export default handler;
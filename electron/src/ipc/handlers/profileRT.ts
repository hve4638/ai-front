import * as utils from '@utils';
import { IPCInvokerName } from 'types';

import runtime from '@/runtime';
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
        /*  */
        [IPCInvokerName.GenerateProfileRTId]: async (profileId: string) => {
            const profile = await runtime.profiles.getProfile(profileId);
            const rtId = await profile.generateRTId();

            return [null, rtId] as const;
        },

        /* 트리 */
        [IPCInvokerName.GetProfileRTTree]: async (profileId: string) => {
            const profile = await runtime.profiles.getProfile(profileId);
            const tree = await profile.getRTTree();

            return [null, tree] as const;
        },
        [IPCInvokerName.UpdateProfileRTTree]: async (profileId: string, tree: any) => {
            const profile = await runtime.profiles.getProfile(profileId);
            profile.updateRTTree(tree);
            saveProfile(profile);

            return [null] as const;
        },

        /* RT 컨트롤 */
        [IPCInvokerName.AddProfileRT]: async (profileId: string, metadata: RTMetadata) => {
            const profile = await runtime.profiles.getProfile(profileId);
            profile.addRT(metadata);
            saveProfile(profile);

            return [null] as const;
        },
        [IPCInvokerName.RemoveProfileRT]: async (profileId: string, promptId: string) => {
            const profile = await runtime.profiles.getProfile(profileId);
            profile.removeRT(promptId);
            saveProfile(profile);
            
            return [null] as const;
        },

        /* RT 데이터 */
        [IPCInvokerName.SetProfileRTData]: async (profileId: string, rtId: string, accessId: string, data:KeyValueInput) => {
            const profile = await runtime.profiles.getProfile(profileId);
            const result = await profile.setRTData(rtId, accessId, data);
            return [null, result] as const;
        },
        [IPCInvokerName.GetProfileRTData]: async (profileId: string, rtId: string, accessorId: string, keys:string[]) => {
            const profile = await runtime.profiles.getProfile(profileId);
            const result = await profile.getRTData(rtId, accessorId, keys);
            return [null, result] as const;
        },
        [IPCInvokerName.ReflectProfileRTMetadata]: async (profileId: string, rtId: string) => {
            const profile = await runtime.profiles.getProfile(profileId);
            profile.updateRTMetadata(rtId);
            
            return [null] as const;
        },

        /* RT 모드 */
        [IPCInvokerName.GetProfileRTMode]: async (profileId: string, rtId: string) => {
            const profile = await runtime.profiles.getProfile(profileId);
            const mode = await profile.getRTMode(rtId);

            return [null, mode] as const;
        },
        [IPCInvokerName.SetProfileRTMode]: async (profileId: string, rtId: string, mode: RTMode) => {
            const profile = await runtime.profiles.getProfile(profileId)
            profile.setRTMode(rtId, mode);
            saveProfile(profile);

            return [null] as const;
        },

        
        [IPCInvokerName.GetProfileRTPromptData]: async (profileId: string, rtId:string, promptId:string, keys:string[]) => {
            const profile = await runtime.profiles.getProfile(profileId);
            const data = await profile.getRTPromptData(rtId, promptId, keys);

            return [null, data] as const;
        },
        [IPCInvokerName.SetProfileRTPromptData]: async (profileId: string, rtId:string, promptId:string, data:KeyValueInput) => {
            const profile = await runtime.profiles.getProfile(profileId);
            profile.setRTPromptData(rtId, promptId, data);

            return [null] as const;
        },

        [IPCInvokerName.HasProfileRTId]: async (profileId: string, rtId: string) => {
            const profile = await runtime.profiles.getProfile(profileId);
            const exists = await profile.hasRTId(rtId);

            return [null, exists] as const;
        },
        [IPCInvokerName.ChangeProfileRTId]: async (profileId: string, oldRTId: string, newRTId: string) => {
            const profile = await runtime.profiles.getProfile(profileId);
            profile.changeRTId(oldRTId, newRTId);
            saveProfile(profile);

            return [null] as const;
        },

        /* RT 요청 */
        [IPCInvokerName.RequestProfileRT]: async (token:string, profileId: string, input:RTInput) => {
            const profile = await runtime.profiles.getProfile(profileId);
            await runtime.rtWorker.request(token, profile, input);

            return [null] as const;
        },
        [IPCInvokerName.AbortProfileRTRequest]: async (token:string) => {
            return [null] as const;
        }
    }
}

export default handler;
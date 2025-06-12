import * as utils from '@utils';
import { IPCInvokerName } from 'types';

import runtime from '@/runtime';
import Profile from '@/features/profiles/Profile';

function handler():IPCInvokerProfileRTs {
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
        async generateId(profileId: string) {
            const profile = await runtime.profiles.getProfile(profileId);
            const rtId = await profile.generateRTId();

            return [null, rtId] as const;
        },

        /* 트리 */
        async getTree(profileId: string) {
            const profile = await runtime.profiles.getProfile(profileId);
            const tree = await profile.getRTTree();

            return [null, tree] as const;
        },
        async updateTree(profileId: string, tree: any) {
            const profile = await runtime.profiles.getProfile(profileId);
            profile.updateRTTree(tree);
            saveProfile(profile);

            return [null] as const;
        },

        /* RT 컨트롤 */
        async createUsingTemplate(profileId: string, rtMetadata:RTMetadata, templateId: string) {
            const profile = await runtime.profiles.getProfile(profileId);
            await profile.createUsingTemplate(rtMetadata, templateId);

            return [null] as const;
        },
        async add(profileId: string, metadata: RTMetadata) {
            const profile = await runtime.profiles.getProfile(profileId);
            await profile.addRT(metadata);
            saveProfile(profile);

            return [null] as const;
        },
        async remove(profileId: string, promptId: string) {
            const profile = await runtime.profiles.getProfile(profileId);
            profile.removeRT(promptId);
            saveProfile(profile);
            
            return [null] as const;
        },

        // [IPCInvokerName.HasProfileRTId]: 
        async existsId(profileId: string, rtId: string) {
            const profile = await runtime.profiles.getProfile(profileId);
            const exists = await profile.hasRTId(rtId);

            return [null, exists] as const;
        },
        // [IPCInvokerName.ChangeProfileRTId]:
        async changeId(profileId: string, oldRTId: string, newRTId: string) {
            const profile = await runtime.profiles.getProfile(profileId);
            profile.changeRTId(oldRTId, newRTId);
            saveProfile(profile);

            return [null] as const;
        },

    }
}

export default handler;
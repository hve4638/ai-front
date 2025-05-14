import runtime from '@/runtime';
import ThrottleAction from '@/features/throttle-action';

function handler():IPCInvokerProfileRT {
    const throttle = ThrottleAction.getInstance();

    return {
        async getMetadata(profileId: string, rtId: string) {
            const profile = await runtime.profiles.getProfile(profileId);
            const rt = profile.rt(rtId);
            const metadata = await rt.getMetadata();

            return [null, metadata];
        },
        async setMetadata(profileId: string, rtId: string, metadata: RTIndex) {
            const profile = await runtime.profiles.getProfile(profileId);
            const rt = profile.rt(rtId);

            await rt.setMetadata(metadata);
            throttle.saveProfile(profile);

            return [null];
        },
        async reflectMetadata(profileId: string, rtId: string) {
            const profile = await runtime.profiles.getProfile(profileId);
            profile.updateRTMetadata(rtId);
            
            return [null];
        },

        async getForms(profileId:string, rtId:string) {
            const profile = await runtime.profiles.getProfile(profileId);
            const rt = profile.rt(rtId);

            const forms = await rt.getForms();
            return [null, forms];
        },

        async addNode(profileId:string, rtId:string, nodeCategory:string) {
            const profile = await runtime.profiles.getProfile(profileId);
            const rt = profile.rt(rtId);

            const nodeId = await rt.addNode(nodeCategory);
            throttle.saveProfile(profile);

            return [null, nodeId];
        },
        async removeNode(profileId:string, rtId:string, nodeId:number) {
            const profile = await runtime.profiles.getProfile(profileId);
            const rt = profile.rt(rtId);

            await rt.removeNode(nodeId);
            throttle.saveProfile(profile);

            return [null];
        },
        async updateNodeOption(profileId:string, rtId:string, nodeId:number, option:Record<string, unknown>) {
            const profile = await runtime.profiles.getProfile(profileId);
            const rt = profile.rt(rtId);
            
            const success = await rt.updateNodeOption(nodeId, option);
            throttle.saveProfile(profile);

            if (success) {
                return [null];
            }
            else {
                return [new Error('Failed to update node option')] as const;
            }
        },
        async connectNode(profileId:string, rtId:string, from:RTNodeEdge, to:RTNodeEdge) {
            const profile = await runtime.profiles.getProfile(profileId);
            const rt = profile.rt(rtId);

            const success = await rt.connectNode(from, to);
            throttle.saveProfile(profile);

            if (success) {
                return [null];
            }
            else {
                return [new Error('Failed to connect node interface')] as const;
            }
        },
        async disconnectNode(profileId:string, rtId:string, from:RTNodeEdge, to:RTNodeEdge) {
            const profile = await runtime.profiles.getProfile(profileId);
            const rt = profile.rt(rtId);

            const success = await rt.disconnectNode(from, to);
            throttle.saveProfile(profile);

            if (success) {
                return [null];
            }
            else {
                return [new Error('Failed to disconnect node interface')] as const;
            }
        }
    }
}

export default handler;
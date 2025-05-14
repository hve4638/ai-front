import runtime from '@/runtime';
import ThrottleAction from '@/features/throttle-action';

function handler():IPCInvokerProfileRTPrompt {
    const throttle = ThrottleAction.getInstance();

    return {
        async getMetadata(profileId:string, rtId:string, promptId:string) {
            const profile = await runtime.profiles.getProfile(profileId);
            const rt = profile.rt(rtId);
            const metadata = await rt.getPromptMetadata(promptId);

            return [null, metadata];
        },

        async getName(profileId:string, rtId:string, promptId:string) {
            const profile = await runtime.profiles.getProfile(profileId);
            const rt = profile.rt(rtId);
            const name = await rt.getPromptName(promptId);

            return [null, name];
        },
        async setName(profileId:string, rtId:string, promptId:string, name:string) {
            const profile = await runtime.profiles.getProfile(profileId);
            const rt = profile.rt(rtId);
            await rt.setPromptName(promptId, name);
            await profile.updateRTMetadata(rtId);
            throttle.saveProfile(profile);

            return [null];
        },

        async getVariableNames(profileId:string, rtId:string, promptId:string) {
            const profile = await runtime.profiles.getProfile(profileId);
            const rt = profile.rt(rtId);
            const names = await rt.getPromptVariableNames(promptId);
            
            return [null, names];
        },
        async getVariables(profileId:string, rtId:string, promptId:string) {
            const profile = await runtime.profiles.getProfile(profileId);
            const rt = profile.rt(rtId);
            const variables = await rt.getPromptVariables(promptId);

            return [null, variables];
        },
        async setVariables(profileId:string, rtId:string, promptId:string, vars:PromptVar[]) {
            const profile = await runtime.profiles.getProfile(profileId);
            const rt = profile.rt(rtId);

            const varIds:string[] = await rt.setPromptVariables(promptId, vars);
            throttle.saveProfile(profile);

            return [null, varIds] as const;
        },
        async removeVariables(profileId:string, rtId:string, promptId:string, varIds:string[]) {
            const profile = await runtime.profiles.getProfile(profileId);
            const rt = profile.rt(rtId);

            await rt.removePromptVariables(promptId, varIds);
            throttle.saveProfile(profile);
            
            return [null];
        },
        
        async getContents(profileId:string, rtId:string, promptId:string) {
            const profile = await runtime.profiles.getProfile(profileId);
            const rt = profile.rt(rtId);
            const contents = await rt.getPromptContents(promptId);

            return [null, contents];
        },
        async setContents(profileId:string, rtId:string, promptId:string, contents:string) {
            const profile = await runtime.profiles.getProfile(profileId);
            const rt = profile.rt(rtId);
            await rt.setPromptContents(promptId, contents);
            throttle.saveProfile(profile);

            return [null];
        },
    }
}

export default handler;
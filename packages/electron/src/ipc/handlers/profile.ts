import runtime from '@/runtime';

function handler():IPCInvokerProfile {
    return {
        async getCustomModels(profileId: string) {
            const profile = await runtime.profiles.getProfile(profileId);
            const models = await profile.model.getCustomModels();

            return [null, models];
        },
        async setCustomModel(profileId: string, model: CustomModel) {
            const profile = await runtime.profiles.getProfile(profileId);
            const customId = await profile.model.setCustomModel(model);

            return [null, customId];

        },
        async removeCustomModel(profileId: string, customId: string) {  
            const profile = await runtime.profiles.getProfile(profileId);
            await profile.model.removeCustomModel(customId);

            return [null];
        }
    }
}

export default handler;
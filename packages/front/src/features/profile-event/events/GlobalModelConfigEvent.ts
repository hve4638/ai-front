import useProfileAPIStore from '@/stores/useProfileAPIStore';

class GlobalModelConfigEvent {
    static async getGlobalConfig(modelId: string):Promise<ModelConfiguration> {
        const { api } = useProfileAPIStore.getState();
        const modelIdFiltered = modelId.replaceAll('.', '_');

        const data = await api.get('model_config.json', [modelIdFiltered]);
        console.log('G>', modelIdFiltered, ':get:', data);
        return data[modelIdFiltered] ?? {};
    }

    static async setGlobalConfig(modelId: string, data: Partial<ModelConfiguration>) {
        const { api } = useProfileAPIStore.getState();
        const modelIdFiltered = modelId.replaceAll('.', '_');

        console.log('S>', modelIdFiltered, ':set:', data);
        await api.set('model_config.json', { [modelIdFiltered]: data });
    }
}

export default GlobalModelConfigEvent;
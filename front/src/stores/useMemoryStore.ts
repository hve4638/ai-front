import { create } from 'zustand';

type MemoryStates = {
    profileId: string | null;
    allModels: ChatAIModels;
    customModels: CustomModel[];
    version: string;
    availableVersion: VersionInfo | null;

    actions: {
        fetchAllModels: () => Promise<void>;
    }
}

const useMemoryStore = create<MemoryStates>((set, get) => ({
    profileId: null,
    allModels: [],
    customModels: [],
    availableVersion: null,
    version: 'unknown',

    actions: {
        fetchAllModels: async () => {
            // const { api } = useProfileAPIStore.getState();
            const { profileId } = get();
            if (profileId == null) return;
        },
    }
}));

export default useMemoryStore;
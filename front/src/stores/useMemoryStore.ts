import { create } from 'zustand';

type MemoryStates = {
    profileId: string | null;
    allModels: ChatAIModels;
    version: string;
    availableVersion: VersionInfo | null;
}

const useMemoryStore = create<MemoryStates>((set, get) => ({
    profileId: null,
    allModels: [],
    availableVersion: null,
    version: 'unknown',
}));

export default useMemoryStore;
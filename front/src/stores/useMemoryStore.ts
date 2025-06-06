import { create } from 'zustand';

type MemoryStates = {
    allModels: ChatAIModels;
    version: string;
    availableVersion: VersionInfo | null;
}

const useMemoryStore = create<MemoryStates>((set, get) => ({
    allModels: [],
    availableVersion: null,
    version: 'unknown',
}));

export default useMemoryStore;
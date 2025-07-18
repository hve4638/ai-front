import { create } from 'zustand'
import ProfilesAPI, { type ProfileAPI } from 'api/profiles';

interface ProfileAPIState {
    api: ProfileAPI;
    setAPI : (profileId:string) => Promise<void>;
}

const useProfileAPIStore = create<ProfileAPIState>((set, get)=>({
    api: ProfilesAPI.getMockProfile(),
    setAPI : async (profileId: string) => {
        const api = ProfilesAPI.profile(profileId);
        set({ api });
    },
}));

export default useProfileAPIStore;
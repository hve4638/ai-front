import { create } from 'zustand'
import ProfilesAPI, { type ProfileAPI } from 'api/profiles';

interface ProfileAPIState {
    api: ProfileAPI;
    setAPI : (profileId:string) => void;
}

export const useProfileAPIStore = create<ProfileAPIState>((set)=>({
    api: ProfilesAPI.getMockProfile(),
    setAPI : async (profileId: string) => {
        const api = await ProfilesAPI.getProfile(profileId);
        set({ api });
    },
}))

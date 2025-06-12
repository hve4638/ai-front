import runtime from '@/runtime';
import ThrottleAction from '@/features/throttle-action';

function handler():IPCInvokerProfileRTStorage {
    const throttle = ThrottleAction.getInstance();

    return {
        async get(profileId: string, rtId:string, accessorId: string, keys: string[]) {
            const profile = await runtime.profiles.getProfile(profileId);
            const accessor = await profile.accessAsJSON(accessorId);
            const value = accessor.get(...keys);
            
            return [null, value] as const;
        },
        async set(profileId: string, rtId:string, accessorId: string, data: KeyValueInput) {
            const profile = await runtime.profiles.getProfile(profileId);
            const accessor = await profile.accessAsJSON(accessorId);
            accessor.set(data);

            throttle.saveProfile(profile);
            
            return [null] as const;
        },
    }
}

export default handler;
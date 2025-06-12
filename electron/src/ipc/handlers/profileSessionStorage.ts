import runtime from '@/runtime';
import ThrottleAction from '@/features/throttle-action';

function handler():IPCInvokerProfileSessionStorage {
    const throttle = ThrottleAction.getInstance();
    
    return {
        async get(profileId: string, sessionId: string, accessorId:string, keys: string[]) {
            const profile = await runtime.profiles.getProfile(profileId);
            const ac = await profile.accessAsJSON(`session:${sessionId}:${accessorId}`);
            
            return [null, ac.get(...keys)] as const;
        },
        
        async set(profileId: string, sessionId: string, accessorId: string, data: KeyValueInput) {
            const profile = await runtime.profiles.getProfile(profileId);
            const ac = await profile.accessAsJSON(`session:${sessionId}:${accessorId}`);
            ac.set(data);
            throttle.saveProfile(profile);

            return [null] as const;
        },

    }
}

export default handler;
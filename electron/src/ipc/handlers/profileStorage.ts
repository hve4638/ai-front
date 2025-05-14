import * as utils from '@utils';
import runtime from '@/runtime';
import Profile from '@/features/profiles/Profile';

function handler():IPCInvokerProfileStorage {
    const throttles = {};

    const saveProfile = (profile:Profile) => {
        const throttleId = `profile_${profile.path}`;
        throttles[throttleId] ??= utils.throttle(500);
        throttles[throttleId](()=>{
            profile.commit();
        });
    }

    return {
        /* 프로필 저장소 */
        async get(profileId: string, id: string, keys: string[]) {
            const profile = await runtime.profiles.getProfile(profileId);
            const accessor = await profile.accessAsJSON(id);
            const value = accessor.get(...keys);
            if (id === 'data.json') {
                console.log(`data.json id: `, JSON.stringify(value));
            }
            return [null, value] as const;
        },
        async set(profileId: string, id: string, data: KeyValueInput) {
            const profile = await runtime.profiles.getProfile(profileId);
            const accessor = await profile.accessAsJSON(id);
            accessor.set(data);

            saveProfile(profile);
            return [null] as const;
        },
        async getAsText(profileId: string, id: string) {
            const profile = await runtime.profiles.getProfile(profileId);
            const accessor = await profile.accessAsText(id);
            return [null, await accessor.read()] as const;
        },
        async setAsText(profileId: string, id: string, value: any) {
            const profile = await runtime.profiles.getProfile(profileId);
            const accessor = await profile.accessAsText(id);
            accessor.write(value);

            return [null] as const;
        },
        async getAsBinary(profileId: string, id: string) {
            const profile = await runtime.profiles.getProfile(profileId);
            const accessor = await profile.accessAsBinary(id);
            return [null, await accessor.read()] as const;
        },
        async setAsBinary(profileId: string, id: string, content: Buffer) {
            const profile = await runtime.profiles.getProfile(profileId);
            const accessor = await profile.accessAsBinary(id);
            accessor.write(content);

            return [null] as const;
        },
        
        async setAsSecret(profileId: string, id: string, data: KeyValueInput) {
            const profile = await runtime.profiles.getProfile(profileId);
            const accessor = await profile.accessAsSecret(id);
            accessor.set(data);

            saveProfile(profile);
            return [null] as const;
        },
        async verifyAsSecret(profileId: string, id: string, keys: string[]) {
            const profile = await runtime.profiles.getProfile(profileId);
            const accessor = await profile.accessAsSecret(id);
            const result = accessor.exists(keys);

            saveProfile(profile);
            return [null, result] as const;
        },
        async removeAsSecret(profileId: string, id: string, keys: string[]) {
            const profile = await runtime.profiles.getProfile(profileId);
            const accessor = await profile.accessAsSecret(id);
            accessor.remove(keys);

            saveProfile(profile);
            return [null] as const;
        },
    }
}

export default handler;
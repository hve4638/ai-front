import runtime from '@/runtime';
import ThrottleAction from '@/features/throttle-action';

function profileSessions():IPCInvokerProfileSessions {
    const throttle = ThrottleAction.getInstance();
    
    return {
        async add(profileId: string) {
            const profile = await runtime.profiles.getProfile(profileId);
            const sid = await profile.sessions.create();

            throttle.saveProfile(profile);
            return [null, sid] as const;
        },
        async remove(profileId: string, sessionId: string) {
            const profile = await runtime.profiles.getProfile(profileId);
            await profile.sessions.remove(sessionId);

            throttle.saveProfile(profile);
            return [null] as const;
        }, 
        async undoRemoved(profileId: string) {
            const profile = await runtime.profiles.getProfile(profileId);
            const sid = await profile.sessions.undoRemove();
            
            throttle.saveProfile(profile);

            if (sid == null) {
                return [new Error('No session to undo')] as const;
            }
            else {
                return [null, sid] as const;
            }
        },
        async reorder(profileId: string, newTabs: string[]) {
            const profile = await runtime.profiles.getProfile(profileId);
            profile.sessions.reorder(newTabs);

            throttle.saveProfile(profile);
            return [null] as const;
        },
        async getIds(profileId: string) {
            const profile = await runtime.profiles.getProfile(profileId);
            const sessions = await profile.sessions.getIds();

            return [null, sessions] as const;
        },
    }
}

export default profileSessions;
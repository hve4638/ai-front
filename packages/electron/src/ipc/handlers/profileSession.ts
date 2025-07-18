import runtime from '@/runtime';
import ThrottleAction from '@/features/throttle-action';

function profileSession():IPCInvokerProfileSession {
    const throttle = ThrottleAction.getInstance();
    
    return {
        async getFormValues(profileId:string, sessionId:string, rtId:string) {
            const profile = await runtime.profiles.getProfile(profileId);
            const values = await profile.session(sessionId).getFormValues(rtId);
            return [null, values];
        },
        async setFormValues(profileId:string, sessionId:string, rtId:string, values:Record<string, any>) {
            const profile = await runtime.profiles.getProfile(profileId);
            const session = profile.session(sessionId);

            session.setFormValues(rtId, values);
            throttle.saveProfile(profile);

            return [null];
        },
    }
}

export default profileSession;
import type { Profile } from '@/features/profiles';
import runtime from '@/runtime';
import * as utils from '@/utils';

class ThrottleAction {
    private throttles: Record<string, Function> = {};

    private constructor() {}

    private static instance: ThrottleAction | null = null;
    static getInstance() {
        if (this.instance === null) {
            this.instance = new ThrottleAction();
        }
        return this.instance;
    }
    saveProfile(profile: Profile) {
        const throttleId = `profile_${profile.path}`;
        this.throttles[throttleId] ??= utils.throttle(1000);
        this.throttles[throttleId](()=>{
            profile.commit();
        });
    }
    saveProfiles() {
        this.throttles['profiles'] ??= utils.throttle(1000);
        this.throttles['profiles'](() => {
            runtime.profiles.saveAll();
        });
    }
    
}

export default ThrottleAction;
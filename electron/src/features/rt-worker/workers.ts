import type { Profile } from "@features/profiles";


class RTWorker {
    constructor() {

    }

    async request(profile:Profile, rtId:string, input:RTInput):Promise<string> {
        let token;
        // const request = profile.getRTRequest(rtId);
        return token;
    }
}
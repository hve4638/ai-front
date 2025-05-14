import runtime from '@/runtime';

function handler():IPCInvokerRequest {
    return {
        async requestRT(token:string, profileId: string, sessionId:string) {
            const profile = await runtime.profiles.getProfile(profileId);
            await runtime.rtWorker.request(token, profile, sessionId);

            return [null] as const;
        },
        async abort(token:string) {
            /// @TODO : 구현 필요

            throw new Error('Not implemented');
            return [null] as const;
        }
    }
}

export default handler;
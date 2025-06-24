import runtime from '@/runtime';
import ThrottleAction from '@/features/throttle-action';

function handler(): IPCInvokerProfileSessionStorage {
    const throttle = ThrottleAction.getInstance();

    return {
        async get(profileId: string, sessionId: string, accessorId: string, keys: string[]) {
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

        // async getInputFiles(profileId: string, sessionId: string): EResult<InputFilePreview[]> {
        //     const profile = await runtime.profiles.getProfile(profileId);
        //     const session = profile.session(sessionId);
        //     return [null, await session.getInputFiles()];
        // },
        async getInputFilePreviews(profileId: string, sessionId: string): EResult<InputFilePreview[]> {
            const profile = await runtime.profiles.getProfile(profileId);
            const session = profile.session(sessionId);
            return [null, await session.getInputFilePreviews()];
        },
        async addInputFile(profileId: string, sessionId: string, filename: string, dataURI: string): EResult<InputFilePreview> {
            const profile = await runtime.profiles.getProfile(profileId);
            const session = profile.session(sessionId);
            const metadata = await session.addInputFile(filename, dataURI);

            return [null, metadata];
        },
        async updateInputFiles(profileId: string, sessionId: string, fileHashes: InputFileHash[]): EResult<InputFilesUpdateInfo> {
            const profile = await runtime.profiles.getProfile(profileId);
            const session = profile.session(sessionId);

            return [null, await session.updateInputFiles(fileHashes)];
        }
    }
}

export default handler;
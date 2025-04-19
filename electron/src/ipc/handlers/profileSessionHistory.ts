import runtime from '@/runtime';
import { IPCInvokerName } from 'types';

function handler() {
    const throttles = {};

    return {
        /* 프로필 세션 히스토리 */
        [IPCInvokerName.GetProfileSessionHistoryMetadata]: async (profileId: string, sessionId: string, offset:number, limit:number) => {
            const profile = await runtime.profiles.getProfile(profileId);
            const accessor = await profile.accessAsHistory(sessionId);
            const historyRows = accessor.getHistory(offset, limit);
            const metadatas:HistoryMetadata[] = historyRows.map(row=>({
                id : row.id,
                requestType : row.chat_type,
                createdAt : row.create_at,
                bookmark : false,
            }));

            return [null, metadatas] as const;
        },
        [IPCInvokerName.SearchProfileSessionHistoryMetadata]: async (profileId: string, sessionId: string) => {
            return [null, [] as HistoryData[]] as const;
        },
        [IPCInvokerName.GetProfileSessionHistoryMessage]: async (profileId: string, sessionId: string, historyIds:number[]) => {
            const profile = await runtime.profiles.getProfile(profileId);
            const accessor = await profile.accessAsHistory(sessionId);

            const messages:HistoryMessage[] = [];
            for (const id of historyIds) {
                const { input, output } = accessor.getMessageText(id);
                messages.push({
                    id : id,
                    input : input,
                    output : output,
                });
            }

            return [null, messages] as const;
        },
        [IPCInvokerName.AddProfileSessionHistory]: async (profileId: string, sessionId: string, history: any) => {
            const profile = await runtime.profiles.getProfile(profileId);
            const accessor = await profile.accessAsHistory(sessionId);
            // const history = accessor.get(offset, limit);

            return [null] as const;
        },
        [IPCInvokerName.DeleteProfileSessionHistory]: async (profileId: string, sessionId: string, historyKey: number) => {
            const profile = await runtime.profiles.getProfile(profileId);
            const accessor = await profile.accessAsHistory(sessionId);

            accessor.delete(historyKey);

            return [null] as const;
        },
        [IPCInvokerName.DeleteAllProfileSessionHistory]: async (profileId: string, sessionId: string) => {
            const profile = await runtime.profiles.getProfile(profileId);
            const accessor = await profile.accessAsHistory(sessionId);

            accessor.deleteAll();

            return [null] as const;
        },
    };
}

export default handler;
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
            const metadata:HistoryMetadata[] = historyRows.map(row=>({
                id : row.id,
                requestType : row.chat_type,
                createdAt : row.create_at,
                bookmark : false,
                rtId : row.rt_id,
                rtUUID : row.rt_uuid,
                modelId : row.model_id,
                form : row.form,
            }));

            return [null, metadata] as const;
        },
        [IPCInvokerName.SearchProfileSessionHistoryMetadata]: async (profileId: string, sessionId: string, offset:number, limit:number, condition:HistorySearch) => {
            const profile = await runtime.profiles.getProfile(profileId);
            const accessor = await profile.accessAsHistory(sessionId);
            const rows = accessor.searchHistory({
                text : condition.text,
                search_scope : condition.searchScope,
                regex : false,
                offset : offset,
                limit : limit,
            });
            const metadata:HistoryMetadata[] = rows.map(row=>({
                id : row.id,
                requestType : row.chat_type,
                createdAt : row.create_at,
                bookmark : false,
                rtId : row.rt_id,
                rtUUID : row.rt_uuid,
                modelId : row.model_id,
                form : row.form,
            }));
            
            return [null, metadata] as const;
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
            throw new Error('Not implemented');
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
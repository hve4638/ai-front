import runtime from '@/runtime';
import { IPCInvokerName } from 'types';

function handler():IPCInvokerProfileSessionHistory {
    const throttles = {};

    return {
        /* 프로필 세션 히스토리 */
        async get(profileId: string, sessionId: string, offset:number, limit:number, desc:boolean) {
            const profile = await runtime.profiles.getProfile(profileId);
            const accessor = await profile.accessAsHistory(sessionId);
            const historyRows = accessor.getHistory(offset, limit, desc);
            const metadata:HistoryMetadata[] = historyRows.map(row=>({
                id : row.id,
                requestType : row.chat_type,
                createdAt : row.create_at,
                bookmark : false,
                rtId : row.rt_id,
                rtUUID : row.rt_uuid,
                modelId : row.model_id,
                form : JSON.parse(row.form),
                isComplete : Boolean(row.is_complete),
            }));

            return [null, metadata] as const;
        },
        async search(profileId: string, sessionId: string, offset:number, limit:number, condition:HistorySearch) {
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
                form : JSON.parse(row.form),
                isComplete : Boolean(row.is_complete),
            }));
            
            return [null, metadata] as const;
        },
        async getMessage(profileId: string, sessionId: string, historyIds:number[]) {
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
        async delete(profileId: string, sessionId: string, historyKey: number) {
            const profile = await runtime.profiles.getProfile(profileId);
            const accessor = await profile.accessAsHistory(sessionId);

            accessor.delete(historyKey);

            return [null] as const;
        },
        async deleteAll(profileId: string, sessionId: string) {
            const profile = await runtime.profiles.getProfile(profileId);
            const accessor = await profile.accessAsHistory(sessionId);

            accessor.deleteAll();

            return [null] as const;
        },
    };
}

export default handler;
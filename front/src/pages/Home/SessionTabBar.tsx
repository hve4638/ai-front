import { useLayoutEffect, useMemo, useState } from 'react';
import TabBar from 'components/TabBar';
import { ProfileSessionMetadata } from 'types';
import { useCacheStore, useDataStore, useProfileEvent } from '@/stores';

function SessionBar({

}) {
    const cacheState = useCacheStore();
    const dataState = useDataStore();
    const eventState = useProfileEvent();

    const [sessionMetadataList, setSessionMetadataList] = useState<ProfileSessionMetadata[]>([]);
    const tabItems = useMemo(()=>sessionMetadataList.map((metadata)=>({...metadata, key:metadata.id})), [sessionMetadataList]);
    const focusTab = useMemo(()=>{
        const empty = {
            key: 'empty',
            id: 'empty',
            name: 'empty',
        };
        if (!cacheState.last_session_id) return empty;
        
        const target = sessionMetadataList.find((item)=>item.id === cacheState.last_session_id);
        if (!target) return empty;

        return {
            ...target,
            key: target.id,
        };
    }, [sessionMetadataList, cacheState.last_session_id]);

    useLayoutEffect(()=>{
        eventState.getSessionMetadataList()
            .then((list)=>{
                setSessionMetadataList(list);
            });
    }, [
        dataState.sessions
    ]);

    useLayoutEffect(()=>{
        console.log('sessionMetadataList', sessionMetadataList);
    }, [sessionMetadataList]);

    return (
        <TabBar
            items={tabItems}
            focus={focusTab}
            onFocus={(item, index)=>{
                cacheState.update.last_session_id(item.id);
            }}
            onAdd={()=>{
                eventState.createSession();
            }}
            onRemove={(item, index)=>{
                eventState.removeSession(item.id);
            }}
            onChangeTabOrder={(list:ProfileSessionMetadata[])=>{
                eventState.reorderSessions(list.map(item=>item.id));
            }}
            onUndoRemove={()=>{
                eventState.undoRemoveSession();
            }}
        />
    );
}

export default SessionBar;
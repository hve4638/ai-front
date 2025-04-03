import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Align, Center, Column, Flex, MouseDrag, Row } from 'components/layout';
import { clamp } from 'utils/math';
import TabBar from 'components/TabBar';
import useDiff from 'hooks/useDiff';
import { ChatSession } from 'types/chat-session';
import { ProfileEventContext, useContextForce } from 'context';
import { useProfile, useProfileStorage } from 'hooks/context';
import { ProfileSessionMetadata } from 'types';

function SessionBar({

}) {
    const {
        sessionIds,
        lastSessionId,
        setLastSessionId,
    } = useProfileStorage();
    const profile = useProfile();
    const {
        getSessionMetadataList,
    } = profile;

    const [sessionMetadataList, setSessionMetadataList] = useState<ProfileSessionMetadata[]>([]);
    const tabItems = useMemo(()=>sessionMetadataList.map((metadata)=>({...metadata, key:metadata.id})), [sessionMetadataList]);
    const focusTab = useMemo(()=>{
        const empty = {
            key: 'empty',
            id: 'empty',
            name: 'empty',
        };
        if (!lastSessionId) return empty;
        
        const target = sessionMetadataList.find((item)=>item.id === lastSessionId);
        if (!target) return empty;

        return {
            ...target,
            key: target.id,
        };
    }, [sessionMetadataList, lastSessionId]);

    useLayoutEffect(()=>{
        getSessionMetadataList()
            .then((list)=>{
                setSessionMetadataList(list);
            });
    }, [sessionIds]);

    useLayoutEffect(()=>{
        console.log('sessionMetadataList', sessionMetadataList);
    }, [sessionMetadataList]);

    return (
        <TabBar
            items={tabItems}
            focus={focusTab}
            onFocus={(item, index)=>{
                setLastSessionId(item.id);
            }}
            onAdd={()=>{
                profile.createSession();
            }}
            onRemove={(item, index)=>{
                profile.removeSession(item.id);
            }}
            onChangeTabOrder={(list:ProfileSessionMetadata[])=>{
                profile.reorderSessions(list.map(item=>item.id));
            }}
            onUndoRemove={()=>{
                profile.undoRemoveSession();
            }}
        />
    );
}

export default SessionBar;
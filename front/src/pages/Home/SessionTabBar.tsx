import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Align, Center, Column, Flex, MouseDrag, Row } from 'lib/flex-widget';
import { clamp } from 'utils/math';
import TabBar from 'components/TabBar';
import useDiff from 'hooks/useDiff';
import { ChatSession } from 'types/chat-session';
import { ProfileContext, useContextForce } from 'context';

function SessionBar({

}) {
    const profileContext = useContextForce(ProfileContext);
    const {
        sessions,
        currentSession,

        createSession,
        removeSession,
        reorderSessions,
        undoRemoveSession,

        setCurrentSession,
    } = profileContext;
    
    const sessionTabs = useMemo(()=>{
        return sessions.map((session, index)=>({...session, key:session.id}))
    }, [sessions]);
    const currentSessionTab = useMemo(()=>{
        if (!currentSession) {
            return {
                key: 'empty',
                id: 'empty',
                name: 'empty',
            };
        }
        return {
            ...currentSession,
            key: currentSession.id
        }
    }, [currentSession]);

    return (
        <TabBar
            items={sessionTabs}
            focus={currentSessionTab}
            onFocus={(item, index)=>{
                setCurrentSession(item.id);
            }}
            onAdd={()=>{
                createSession();
            }}
            onRemove={(item, index)=>{
                removeSession(item.id);
            }}
            onChangeTabOrder={(items)=>{
                reorderSessions(items as ChatSession[]);
            }}
            onUndoRemove={()=>{
                undoRemoveSession();
            }}
        />
    );
}

export default SessionBar;
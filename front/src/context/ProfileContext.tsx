import React, { useState, createContext, useLayoutEffect, useEffect, useMemo } from 'react';
import { useContextForce } from './useContextForce';
import { RawProfileContext } from './RawProfileContext';
import { ChatSession } from 'types/chat-session';
import { IProfileSession } from 'features/profiles';
import useDebounce from 'hooks/useDebounce';
import type { Configs, SetState, SetStateAsync, Shortcuts } from './types';

interface ProfileContextType {
    createSession: () => void;
    removeSession: (sessionId:string) => void;
    reorderSessions: (sessions:ChatSession[]) => void;
    undoRemoveSession: () => void;

    sessions: ChatSession[];
    currentSession: ChatSession|undefined;
    setCurrentSession: (session:ChatSession|string) => void;

    getProfileSession: (sessionId:string) => IProfileSession;

    starredModels:string[];
    isModelStarred: (key:string)=>boolean;
    starModel: (key:string)=>void;
    unstarModel: (key:string)=>void;

    configs:Configs;
    shortcuts:Shortcuts;
}

/**
 * ProfileStorage 관리
 */
export const ProfileContext = createContext<ProfileContextType|null>(null);

export function ProfileContextProvider({children}: {children:React.ReactNode}) {
    const rawProfileContext = useContextForce(RawProfileContext);
    const {
        profile,
        sessionIds, refetchSessionIds,
        lastSessionId, setLastSessionId,
        starredModels : rawStarredModels,
        setStarredModels : setRawStarredModels,

        shortcuts, configs,
    } = rawProfileContext;

    const [sessionDict, setSessionDict] = useState<Map<string, ChatSession>>(new Map());
    const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
    const [lastChatSession, setLastChatSession] = useState<ChatSession>();
    const starredModels = useMemo(()=>new Set(rawStarredModels), [rawStarredModels]);

    const createSession = async () => {
        const sid = await profile.createSession();
        await setLastSessionId(sid);
        await refetchSessionIds();
    }
    const removeSession = async (sessionId:string) => {
        await profile.removeSession(sessionId);

        if (sessionIds.length == 1) {
            await createSession();
        }
        else if (sessionId === lastSessionId) {
            const prevIndex = sessionIds.indexOf(sessionId);
            if (prevIndex < 0) {
                await setLastSessionId(sessionIds[0]);
            }
            else if (prevIndex === 0) {
                await setLastSessionId(sessionIds[1]);
            }
            else {
                await setLastSessionId(sessionIds[prevIndex - 1]);
            }
            await refetchSessionIds();
        }
        else {
            await refetchSessionIds();
        }
    }
    const reorderSessions = async (sessions:ChatSession[]) => {
        await profile.reorderSessions(sessions.map(item=>item.id));
        await refetchSessionIds();
    }
    const setCurrentSession = async (session:ChatSession|string) => {
        const sid = typeof session === 'string' ? session : session.id;

        if (sid !== lastSessionId) {
            await setLastSessionId(sid);
        }
    }
    const undoRemoveSession = async () => {
        await profile.undoRemoveSession();
        await refetchSessionIds();
    }

    const getProfileSession = (sessionId:string) => {
        return profile.getSession(sessionId);
    }

    const isModelStarred = (modelKey:string) => {
        return starredModels.has(modelKey);
    }
    const starModel = async (modelKey:string) => {
        setRawStarredModels([...rawStarredModels, modelKey]);
    }
    const unstarModel = async (modelKey:string) => {
        const next = rawStarredModels.filter(item=>item !== modelKey);
        setRawStarredModels(next);
    }

    useEffect(() => {
        (async ()=>{
            const newSessions:ChatSession[] = [];
            if (sessionIds == null) {
                return;
            }
            
            for (const sid of sessionIds) {
                if (!sessionDict.has(sid)) {
                    const profileSession = profile.getSession(sid);

                    const chatSession:ChatSession = {
                        id : sid,
                        name : await profileSession.getData('config.json', 'name') ?? sid,
                        color : await profileSession.getData('config.json', 'color'),
                        deleteLock : await profileSession.getData('config.json', 'delete_lock') ?? false,
                        modelKey : await profileSession.getData('config.json', 'model_key'),
                        promptKey : await profileSession.getData('config.json', 'prompt_key'),
                    }
                    sessionDict.set(sid, chatSession);
                }
                newSessions.push(sessionDict.get(sid)!);
            }

            setChatSessions(newSessions);
        })();
    }, [sessionIds]);

    useEffect(() => {
        if (lastSessionId === undefined) { // 로딩 중
            return;
        }

        if (lastSessionId !== null && sessionDict.has(lastSessionId)) {
            setLastChatSession(sessionDict.get(lastSessionId)!);
        }
        else {
            setLastChatSession(chatSessions[0]);
        }
    }, [chatSessions, lastSessionId]);
    
    return (
        <ProfileContext.Provider
            value={{
                createSession,
                removeSession,
                reorderSessions,
                undoRemoveSession,

                sessions : chatSessions,
                currentSession : lastChatSession,
                setCurrentSession,
                getProfileSession,

                
                starredModels : rawStarredModels,
                isModelStarred,
                starModel,
                unstarModel,
                
                configs,
                shortcuts,
            }}
        >
            {children}
        </ProfileContext.Provider>
    )
}
import React, { useState, createContext, useLayoutEffect, useEffect, useMemo } from 'react';
import { useContextForce } from './useContextForce';
import { RawProfileContext } from './RawProfileContext';
import { ChatSession } from 'types/chat-session';
import { IProfileSession } from 'features/profilesAPI';
import useDebounce from 'hooks/useDebounce';
import type { Configs, SetState, SetStateAsync, Shortcuts } from './types';
/*
    ProfileContext는 RawProfileContext를 읽기전용 상태값과 이벤트(함수)를 노출
*/

interface ProfileContextType {
    /* 세션 관리 */
    createSession: () => Promise<void>;
    removeSession: (sessionId:string) => void;
    reorderSessions: (sessions:ChatSession[]) => void;
    undoRemoveSession: () => void;

    sessions: ChatSession[];
    currentSession: ChatSession|undefined;
    setCurrentSession: (session:ChatSession|string) => void;

    getProfileSession: (sessionId:string) => IProfileSession;

    /* 모델 즐겨찾기 */
    starredModels:string[];
    isModelStarred: (key:string)=>boolean;
    starModel: (key:string)=>void;
    unstarModel: (key:string)=>void;
    
    /* 요청 템플릿 */
    getRTTree: () => Promise<RTMetadataTree>;
    updateRTTree: (tree:RTMetadataTree) => Promise<void>;
    hasRTId: (id:string) => Promise<boolean>;
    generateRTId: () => Promise<string>;
    changeRTId: (oldId:string, newId:string) => Promise<void>;
    addRT: (metadata:RTMetadata) => Promise<void>;
    removeRT: (rtId:string) => Promise<void>;
    setRTMode: (rtId:string, mode:RTMode) => Promise<void>;
    getRTMode: (rtId:string) => Promise<RTMode>;
    setRTPromptText: (rtId:string, promptText:string) => Promise<void>;
    getRTPromptText: (rtId:string) => Promise<string>;

    /* 이외 */
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
        // profile은 ProfileContext에서 직접 노출하지 않도록 함
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

    const values:ProfileContextType = {
        sessions : chatSessions,
        currentSession : lastChatSession,
        async createSession() {
            const sid = await profile.createSession();
            await setLastSessionId(sid);
            await refetchSessionIds();
        },
        async removeSession (sessionId:string) {
            await profile.removeSession(sessionId);
    
            if (sessionIds.length == 1) {
                await values.createSession();
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
        },
        async reorderSessions(sessions:ChatSession[]) {
            await profile.reorderSessions(sessions.map(item=>item.id));
            await refetchSessionIds();
        },
        async setCurrentSession(session:ChatSession|string) {
            const sid = typeof session === 'string' ? session : session.id;
    
            if (sid !== lastSessionId) {
                await setLastSessionId(sid);
            }
        },
        async undoRemoveSession() {
            await profile.undoRemoveSession();
            await refetchSessionIds();
        },
        getProfileSession(sessionId:string) {
            return profile.getSession(sessionId);
        },

        /* 모델 즐겨찾기 */
        starredModels : rawStarredModels,
        isModelStarred(modelKey:string) {
            return starredModels.has(modelKey);
        },
        async starModel(modelKey:string) {
            setRawStarredModels([...rawStarredModels, modelKey]);
        },
        async unstarModel(modelKey:string) {
            const next = rawStarredModels.filter(item=>item !== modelKey);
            setRawStarredModels(next);
        },

        /* 요청 템플릿 */
        async getRTTree() { return await profile.getRTTree(); },
        async updateRTTree(tree:RTMetadataTree) { await profile.updateRTTree(tree); },
        async addRT(metadata:RTMetadata) { return await profile.addRT(metadata); },
        async removeRT(rtId:string) { return await profile.removeRT(rtId); },
        async setRTMode(rtId:string, mode:RTMode) { return await profile.setRTMode(rtId, mode); },
        async getRTMode(rtId:string) { return await profile.getRTMode(rtId); },
        async generateRTId() { return await profile.generateRTId(); },
        async changeRTId(oldId:string, newId:string) { return await profile.changeRTId(oldId, newId); },
        async hasRTId(id:string) { return await profile.hasRTId(id); },
        async setRTPromptText(rtId:string, promptText:string) { return await profile.setRTPromptText(rtId, promptText); },
        async getRTPromptText(rtId:string) { return await profile.getRTPromptText(rtId); },
                
        configs,
        shortcuts,
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
            value={values}
        >
            {children}
        </ProfileContext.Provider>
    )
}
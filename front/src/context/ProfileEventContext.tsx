import React, { useState, createContext, useLayoutEffect, useEffect, useMemo } from 'react';
import { useContextForce } from './useContextForce';
import { ProfileStorageContext } from './ProfileStorageContext';
import { ChatSession } from 'types/chat-session';
import { IProfileSession } from 'features/profilesAPI';
import useDebounce from 'hooks/useDebounce';
import type { Configs, SetState, SetStateAsync, Shortcuts } from './types';

interface ProfileEventContextType {
    /* 세션 관리 */
    createSession: () => Promise<void>;
    removeSession: (sessionId:string) => void;
    reorderSessions: (sessions:ChatSession[]) => void;
    undoRemoveSession: () => void;

    sessions: ChatSession[];
    currentSession: ChatSession|undefined;
    setCurrentSession: (session:ChatSession|string) => void;

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

    /* 이외 */
    configs:Configs;
    shortcuts:Shortcuts;
}

/**
 * ProfileStorage 관리
 */
export const ProfileEventContext = createContext<ProfileEventContextType|null>(null);

export function ProfileEventContextProvider({children}: {children:React.ReactNode}) {
    const profileStorage = useContextForce(ProfileStorageContext);
    const {
        api,
        sessionIds, refetchSessionIds,
        lastSessionId, setLastSessionId,
        starredModels, setStarredModels,

        shortcuts, configs,
    } = profileStorage;

    const [sessionDict, setSessionDict] = useState<Map<string, ChatSession>>(new Map());
    const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
    const [lastChatSession, setLastChatSession] = useState<ChatSession>();
    const starredModelSet = useMemo(()=>new Set(starredModels), [starredModels]);

    const values:ProfileEventContextType = {
        sessions : chatSessions,
        currentSession : lastChatSession,
        async createSession() {
            const sid = await api.createSession();
            await profileStorage.setLastSessionId(sid);
            await profileStorage.refetchSessionIds();
        },
        async removeSession (sessionId:string) {
            await api.removeSession(sessionId);
    
            // 세션 0개는 허용되지 않으므로 제거 후 새 세션 생성
            if (sessionIds.length == 1) {
                await values.createSession();
            }
            // 현재 가르키는 세션 제거 시, 가르키는 세션을 변경
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
            }

            await refetchSessionIds();
        },
        async reorderSessions(sessions:ChatSession[]) {
            await api.reorderSessions(sessions.map(item=>item.id));
            await refetchSessionIds();
        },
        async setCurrentSession(session:ChatSession|string) {
            const sid = (typeof session === 'string') ? session : session.id;
    
            if (sid !== lastSessionId) {
                await setLastSessionId(sid);
            }
        },
        async undoRemoveSession() {
            await api.undoRemoveSession();
            await refetchSessionIds();
        },

        /* 모델 즐겨찾기 */
        starredModels : starredModels,
        isModelStarred(modelKey:string) {
            return starredModelSet.has(modelKey);
        },
        async starModel(modelKey:string) {
            setStarredModels([...starredModels, modelKey]);
        },
        async unstarModel(modelKey:string) {
            const next = starredModels.filter(item=>item !== modelKey);
            setStarredModels(next);
        },

        /* 요청 템플릿 */
        async getRTTree() { return await api.getRTTree(); },
        async updateRTTree(tree:RTMetadataTree) { await api.updateRTTree(tree); },
        async addRT(metadata:RTMetadata) { return await api.addRT(metadata); },
        async removeRT(rtId:string) { return await api.removeRT(rtId); },
        async generateRTId() { return await api.generateRTId(); },
        async changeRTId(oldId:string, newId:string) { return await api.changeRTId(oldId, newId); },
        async hasRTId(id:string) { return await api.hasRTId(id); },
                
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
                    const sessionAPI = api.getSession(sid);
                    const {
                        name,
                        color,
                        delete_lock,
                        model_key,
                        prompt_key
                    } = await sessionAPI.get('config.json', [
                        'name', 'color', 'delete_lock', 'model_key', 'prompt_key'
                    ]);
                    const chatSession:ChatSession = {
                        id : sid,
                        name : name ?? sid,
                        color : color,
                        deleteLock : delete_lock ?? false,
                        modelKey : model_key,
                        promptKey : prompt_key,
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
        <ProfileEventContext.Provider
            value={values}
        >
            {children}
        </ProfileEventContext.Provider>
    )
}
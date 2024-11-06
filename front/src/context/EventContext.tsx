import React, { useContext, useState, createContext, useCallback } from 'react';
import { NOSESSION_KEY, SESSION_TEMPLATE, APIRESPONSE_TEMPLATE } from 'data/constants';
import { FetchStatus } from 'data/interface.ts';

import { ChatSession } from './interface.ts';
import { MemoryContext } from './MemoryContext.tsx';
import { RawProfileContext } from './RawProfileContext.tsx';
import { IPromptMetadata } from 'features/prompts';
import { useContextForce } from './index.ts';

import { LLMAPIResponse } from 'types/llmapi.ts';
import { SessionContext } from './SessionContext.tsx';
import { defaultChatSession } from 'data/chat.ts';

/**
 * EventContext는 MemeoryContext, StoreContext, rawProfileContext의 상태를 변경하는 함수를 제공한다
 */


interface EventContextType {
    /** 현 세션 기반으로 새 세션 생성 */
    createSession:()=>void;
    /** 세션 삭제, 대상이 현 세션일 경우 다른 세션 중 하나를 새로운 현 세션으로 지정 */
    deleteSession:(session:ChatSession)=>void;
    /* 현재 세션 변경 */
    changeCurrentSession:(session:ChatSession)=>void;
    /** @deprecated */
    commitCurrentSession:()=>void;
    /** 언어모델 API 요청 */
    enqueueApiRequest:({session, input, promptText}:enqueueApiRequestArgs)=>void;
    /** Session의 언어모델API 요청 Fetch 상태 지정 */
    changeFetchStatus:(session:ChatSession, status:FetchStatus)=>void;
    /** Session의 언어모델API 요청 Fetch 상태 가져오기 */
    getFetchStatus:(session:ChatSession)=>FetchStatus;
    /**
     * 현재 promptMetadata를 변경 후 현 세션의 promptKey 갱신
     */
    setCurrentPromptMetadata:(metadata:IPromptMetadata, nocommit?:boolean)=>void;
    /**
     * 변수를 캐시/파일시스템 저장
     */
    commitPromptMetdataVariable:(metadata:IPromptMetadata)=>void;
    /**
     * 현재 세션의 PromptMetadata 변수 업데이트
    */
    setCurrentPromptMetadataVar:(varname:string, value:any)=>void;
    addErrorLog(title:string, message:string):void;
}

interface enqueueApiRequestArgs {
    session:ChatSession;
    input:string;
    promptText:string;
    promptMetadata:IPromptMetadata;
}


function getEmptyAPIResponse():LLMAPIResponse {
    return {
        input : '',
        output : '',
        prompt : '',
        note : {},
        tokens : 0,
        finishreason : '',
        warning : '',
        normalresponse : true,
        error : ''
      }
}

export const EventContext = createContext<EventContextType|null>(null);

export function EventContextProvider({children}) {
    const memoryContext = useContextForce(MemoryContext);
    const sessionContext = useContextForce(SessionContext);
    const rawProfileContext = useContextForce(RawProfileContext);
    const {
        sessionFetchStatus,
    } = memoryContext;

    const makeChatSessionFromCurrent:()=>ChatSession = useCallback(() => {
        const lastSession = sessionContext.exportSession();
        const newSession = {
            ...SESSION_TEMPLATE,
            promptKey : lastSession.promptKey,
            modelName : lastSession.modelName,
            modelCategory : lastSession.modelCategory,
            color : lastSession.color,
            chatIsolation : true,
            historyIsolation : true,
            id : rawProfileContext.nextSessionID,
        };
        rawProfileContext.setNextSessionID(prev=>prev+1);
        return newSession;
    }, [sessionContext, memoryContext, rawProfileContext.nextSessionID])
    const makeTemporaryChatSession:()=>ChatSession = useCallback(() => {
        const lastSession = sessionContext.exportSession();
        const newSession = {
            ...defaultChatSession,
            id : -1,
            promptKey : lastSession.promptKey,
            modelName : lastSession.modelName,
            modelCategory : lastSession.modelCategory,
            chatIsolation : false,
            historyIsolation : false,
        }
        return newSession;
    }, [sessionContext]);

    const contextValues:EventContextType = {
        createSession() {
            /*
                storeContext : nextSessionID, currentSessionID
                memoryContext : currentSession, currentPromptMetadata, currentChat 갱신
            */
            const newSession = makeChatSessionFromCurrent();

            const metadata = memoryContext.currentPromptMetadata.copy();
            newSession.note = metadata.getVarValues(),
            
            rawProfileContext.setLastSessionId(newSession.id); // 현 세션 지정
            rawProfileContext.setSessions(prev=>[...prev, newSession]); // 세션 목록 업데이트
        },
        deleteSession(session) {
            /*
                영향을 받는 contextValue
                - rawProfileContext.sessions
                - rawProfileContext.responses
            */
            const prevSessions = rawProfileContext.sessions;

            if (prevSessions.length === 0) return;

            // 현 세션이 제거된 sessions
            const newSessions = prevSessions.filter((s, index) => s.id !== session.id);
            rawProfileContext.setSessions(newSessions);
            
            // 제거된 세션이 현 세션일 경우
            if (sessionContext.sessionId == session.id) {
                // 마지막 입력&응답 정보 제거
                if (session.id in rawProfileContext.lastChats) {
                    rawProfileContext.setLastChats(prev=>{
                        const newChats = { ...prev };
                        delete newChats[session.id];
                        return newChats;
                    });
                }
                
                let newSession: ChatSession;
                // 남은 세션이 없다면 임시 세션 생성
                if (newSessions.length === 0) {
                    newSession = makeTemporaryChatSession();
                }
                // 삭제된 세션의 index가 가르키는 세션을 찾음
                else {
                    let nextIndex = 0;
                    for (const i in prevSessions) {
                        // 제거된 세션이 마지막 세션이라면, 가르키는 index를 하나 당김
                        if (prevSessions[i].id === session.id) {
                            nextIndex = Number(i);
                            if (nextIndex === prevSessions.length-1) {
                                nextIndex -= 1;
                            }
                            break;
                        }
                    }
                    newSession = {...newSessions[nextIndex]}
                }
                
                contextValues.changeCurrentSession(newSession);
            }
        },
        changeCurrentSession(session:ChatSession, nocommit:boolean=false) {
            sessionContext.importSession(session);
            rawProfileContext.setLastSessionId(session.id);
        },
        commitCurrentSession() {
            // Nothing to do
        },
        enqueueApiRequest({session, input, promptText, promptMetadata}:enqueueApiRequestArgs) {
            // @TODO : 구조 변경 예정

            // ApiFetchQueue는 EffectHandler 에서 처리됨
            memoryContext.setApiFetchQueue((queue)=>{
                const newQueue = [...queue];
                newQueue.push({
                    sessionid : session.id,
                    input: input,
                    promptMetadata : promptMetadata,
                    promptText : promptText,
                });
    
                return newQueue;
            })
        },
        changeFetchStatus(session:ChatSession, status:FetchStatus) {
            const key = (session.id >= 0 && session.chatIsolation) ? session.id : NOSESSION_KEY;
            
            memoryContext.setSessionFetchStatus((sessionStatus)=>{
                const newSessionStatus = {...sessionStatus};
                newSessionStatus[key] = status;
                return newSessionStatus;
            });
        },
        getFetchStatus(session:ChatSession) {
            const key = (session.id >= 0 && session.chatIsolation) ? session.id : NOSESSION_KEY;
            
            if (key in sessionFetchStatus) {
                return sessionFetchStatus[key];
            }
            else {
                return FetchStatus.IDLE;
            }
        },


        ...([] as any)
    }
    
    return (
        <EventContext.Provider
            value={contextValues}
        >
            {children}
        </EventContext.Provider>
    )
}
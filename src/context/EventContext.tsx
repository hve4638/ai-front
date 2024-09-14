import React, { useContext, useState, createContext } from "react";
import { NOSESSION_KEY, SESSION_TEMPLATE, APIRESPONSE_TEMPLATE } from "data/constants";
import { FetchStatus } from "data/interface.ts";

import { ChatSession } from "./interface.ts";
import { StoreContext } from "./StoreContext.tsx";
import { MemoryContext } from "./MemoryContext.tsx";
import { IPromptMetadata } from "features/prompts";
import { useContextForce } from "./index.ts";
import { LocalInteractive } from "services/local/index.ts";

interface EventContextType {
    /**
     * 현 세션 기반으로 새 세션 생성
     * 
     * storeContext : nextSessionID, currentSessionID 갱신
     * 
     * memoryContext : currentSession, currentPromptMetadata, currentChat 갱신
     */
    createSession:()=>void;
    /**
     * 세션 삭제하고 대상이 현 세션일 경우 다른 세션 중 하나를 새로운 현 세션으로 지정
     */
    deleteSession:(session:ChatSession)=>void;
    changeCurrentSession:(session:ChatSession)=>void;
    commitCurrentSession:()=>void;
    enqueueApiRequest:({session, input, promptText}:enqueueApiRequestArgs)=>void;
    changeFetchStatus:(session:ChatSession, status:FetchStatus)=>void;
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

const getDefaultAPIResponse = () => {
    return {
        input : "",
        output : "",
        prompt : "",
        note : "",
        tokens : "",
        finishreason : "",
        warning : "",
        normalresponse : true,
        error : ""
      }
}

export const EventContext = createContext<EventContextType|null>(null);

export function EventContextProvider({children}) {
    const memoryContext = useContextForce(MemoryContext);
    const storeContext = useContextForce(StoreContext);

    const {
        sessions, setSessions,
        history,
        responses, setResponses,
    } = storeContext;
    const {
        currentHistory, setCurrentHistory,
        currentChat, setCurrentChat,
        currentSession, setCurrentSession,
        sessionFetchStatus, setSessionFetchStatus,
    } = memoryContext;

    const createSession = () => {
        const { nextSessionID } = storeContext;
        const metadata = memoryContext.currentPromptMetadata.copy();

        const newSession:ChatSession = {
            ...SESSION_TEMPLATE,
            promptKey : currentSession.promptKey,
            modelName : currentSession.modelName,
            modelCategory : currentSession.modelCategory,
            color : currentSession.color,
            note : metadata.getVarValues(),
            chatIsolation : currentSession.chatIsolation,
            historyIsolation : currentSession.historyIsolation,
            id : nextSessionID,
        };
        
        if (newSession.chatIsolation) {
            memoryContext.setCurrentChat({...APIRESPONSE_TEMPLATE});
        }

        memoryContext.setCurrentSession(newSession);
        memoryContext.setCurrentPromptMetadata(metadata);
        storeContext.setNextSessionID(nextSessionID+1);
        storeContext.setCurrentSessionId(newSession.id);

        const newSessions:ChatSession[] = [...sessions, newSession];
        storeContext.setSessions(newSessions);
    }
    const deleteSession = (session) => {
        const newSessions = sessions.filter((s, index) => s.id !== session.id);
        setSessions(newSessions);
        
        if (currentSession.id == session.id) {
            let index:number|null = null;
            for (const i in sessions) {
                if (sessions[i].id == currentSession.id) {
                    index = Number(i);
                    if (index == sessions.length-1) {
                        index -= 1;
                    }
                    break;
                }
            }

            if (session.id in responses) {
                const newResponses = {...responses}
                delete newResponses[session.id];
                setResponses(newResponses);
            }
            
            let newSession;
            if (index === null || newSessions.length === 0) {
                newSession = {...currentSession}
                newSession.id = -1;
                newSession.chatIsolation = false;
                newSession.historyIsolation = false;
            }
            else {
                newSession = {...newSessions[index]}
            }

            changeCurrentSession(newSession);
        }
    }
    const changeCurrentSession = (session:ChatSession, nocommit:boolean=false) => {
        if (!nocommit) commitCurrentSession();
        
        if (session.chatIsolation) {
            memoryContext.setCurrentChat(responses[session.id] ?? getDefaultAPIResponse());
        }
        else if (currentSession.chatIsolation) {
            memoryContext.setCurrentChat(responses[NOSESSION_KEY] ?? getDefaultAPIResponse());
        }
        if (session.historyIsolation) {
            memoryContext.setCurrentHistory(history[session.id] ?? []);
        }
        else if (currentSession.historyIsolation) {
            memoryContext.setCurrentHistory(history[NOSESSION_KEY] ?? []);
        }
        
        const tree = memoryContext.promptMetadataTree;
        const metadata = tree.getPromptMetadata(session.promptKey)!.copy();
        metadata.setVarValues(session.note);
        
        memoryContext.setCurrentPromptMetadata(metadata);
        memoryContext.setCurrentSession(session);
        storeContext.setCurrentSessionId(session.id);
    }
    /**
     * 현 세션 정보를 history, responses에 반영
     */
    const commitCurrentSession = () => {
        if (currentSession === null) return;

        const newHistory = {...history};
        if (currentSession.historyIsolation) {
            newHistory[currentSession.id] = currentHistory;
        }
        else {
            newHistory[NOSESSION_KEY] = currentHistory;
        }
        storeContext.setHistory(newHistory);

        const newResponses = {...responses};
        if (currentSession.chatIsolation) {
            newResponses[currentSession.id] = currentChat;
        }
        else {
            newResponses[NOSESSION_KEY] = currentChat;
        }
        storeContext.setResponses(newResponses);
    }
    const enqueueApiRequest = ({session, input, promptText, promptMetadata}:enqueueApiRequestArgs) => {
        memoryContext.setApiFetchQueue((queue)=>{
            const newQueue = [...queue];
            newQueue.push({
                sessionid : session.id,
                input: input,
                // note : session.note,
                promptMetadata : promptMetadata,
                promptText : promptText,
            });

            return newQueue;
        })
    }
    const changeFetchStatus = (session, status) => {
        const key = (session.id >= 0 && session.chatIsolation) ? session.id : NOSESSION_KEY;
        
        setSessionFetchStatus((sessionStatus)=>{
            const newSessionStatus = {...sessionStatus};
            newSessionStatus[key] = status;
            return newSessionStatus;
        });
    }
    const getFetchStatus = (session) => {
        const key = (session.id >= 0 && session.chatIsolation) ? session.id : NOSESSION_KEY;
        
        if (key in sessionFetchStatus) {
            return sessionFetchStatus[key];
        }
        else {
            return FetchStatus.IDLE;
        }
    }

    const commitPromptMetdataVariable = (metadata:IPromptMetadata) => {
        metadata.commitCurrentVarValue();
        /*
        const newLastvar = {
            ...storeContext.lastvar,
            [metadata.key] : metadata.getVarValues(),
        }
        storeContext.setLastvar(newLastvar);
        LocalInteractive.echo(`${JSON.stringify(metadata.getVarValues())}`);
        */
    }

    // 현재 promptMetadata 변수 정보를 commit 후 새 metadata로 교체
    const setCurrentPromptMetadata = (metadata:IPromptMetadata, nocommit:boolean=false) => {
        if (!nocommit) {
            commitPromptMetdataVariable(memoryContext.currentPromptMetadata);
        }
        
        const newSession: ChatSession = {
            ...currentSession,
            promptKey: metadata.key,
            note: metadata.getVarValues(),
        }
        memoryContext.setCurrentSession(newSession);
        memoryContext.setCurrentPromptMetadata(metadata.copy());
    }

    const setCurrentPromptMetadataVar = (varname:string, value:any) => {
        const {
            currentSession,
            currentPromptMetadata
        } = memoryContext;
        
        currentPromptMetadata.setVarValue(varname, value);

        const newSession = {
            ...currentSession,
            note : memoryContext.currentPromptMetadata.getVarValues(),
        }
        memoryContext.setCurrentSession(newSession);
    }
    const addErrorLog = (title:string, message:string) => {
        const newErrorLogs = [...memoryContext.errorLogs];
        newErrorLogs.push({name:title, message:message});
        memoryContext.setErrorLogs(newErrorLogs);
    }
    
    return (
        <EventContext.Provider
            value={{
                createSession,
                deleteSession,
                changeCurrentSession,
                commitCurrentSession,
                enqueueApiRequest,
                changeFetchStatus,
                getFetchStatus,
                setCurrentPromptMetadata,
                setCurrentPromptMetadataVar,
                commitPromptMetdataVariable,
                addErrorLog,
            }}
        >
            {children}
        </EventContext.Provider>
    )
}
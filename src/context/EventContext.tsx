import React, { useContext, useState, createContext } from "react";
import { NOSESSION_KEY, SESSION_TEMPLATE, APIRESPONSE_TEMPLATE } from "data/constants.tsx";
import { FetchStatus } from "data/interface.ts";

import { ChatSession } from "./interface.ts";
import { StoreContext } from "./StoreContext.tsx";
import { MemoryContext } from "./MemoryContext.tsx";

interface EventContextType {
    createSession:()=>void;
    deleteSession:(session:ChatSession)=>void;
    changeCurrentSession:(session:ChatSession)=>void;
    commitCurrentSession:()=>void;
    enqueueApiRequest:({session, input, promptText}:enqueueApiRequestArgs)=>void;
    changeFetchStatus:(session:ChatSession, status:FetchStatus)=>void;
    getFetchStatus:(session:ChatSession)=>FetchStatus;
}
const ANY:any = null;

interface enqueueApiRequestArgs {
    session:ChatSession;
    input:string;
    promptText:string;
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
    const memoryContext = useContext(MemoryContext);
    const storeContext = useContext(StoreContext);
    if (!memoryContext) throw new Error("<EventContext/> required MemoryContextProvider");
    if (!storeContext) throw new Error("<EventContext/> required StoreContextProvider");

    const {
        sessions, setSessions,
        currentSessionId, setCurrentSessionId,
        history, setHistory,
        responses, setResponses,
        nextSessionID, setNextSessionID,
    } = storeContext;
    const {
        currentHistory, setCurrentHistory,
        currentChat, setCurrentChat,
        currentSession, setCurrentSession,
        apiFetchQueue, setApiFetchQueue,
        sessionFetchStatus, setSessionFetchStatus,
    } = memoryContext;

    const createSession = () => {
        const newSession:ChatSession = {
            ...SESSION_TEMPLATE,
            promptKey : currentSession.promptKey,
            modelName : currentSession.modelName,
            modelCategory : currentSession.modelCategory,
            color : currentSession.modelCategory,
            note : {...currentSession.note},
            chatIsolation : currentSession.chatIsolation,
            historyIsolation : currentSession.historyIsolation,
            id : nextSessionID,
        };
        
        setNextSessionID(nextSessionID+1);
        
        if (newSession.chatIsolation) {
            setCurrentChat({...APIRESPONSE_TEMPLATE});
        }
        setCurrentSession(newSession);
        setCurrentSessionId(newSession.id);

        const newSessions = [...sessions, newSession];
        setSessions(newSessions);
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
            // setCurrentSession(newSession);
            // setCurrentSessionId(newSession.id);
        }
    }
    const changeCurrentSession = (session, nocommit:boolean=false) => {
        if (!nocommit) commitCurrentSession();
        
        if (session.chatIsolation) {
            setCurrentChat(responses[session.id] ?? getDefaultAPIResponse());
        }
        else if (currentSession.chatIsolation) {
            setCurrentChat(responses[NOSESSION_KEY] ?? getDefaultAPIResponse());
        }
        if (session.historyIsolation) {
            setCurrentHistory(history[session.id] ?? []);
        }
        else if (currentSession.historyIsolation) {
            setCurrentHistory(history[NOSESSION_KEY] ?? []);
        }

        setCurrentSession(session);
        setCurrentSessionId(session.id);
    }
    const commitCurrentSession = () => {
        if (currentSession === null) return;

        const newHistory = {...history};
        if (currentSession.historyIsolation) {
            newHistory[currentSession.id] = currentHistory;
        }
        else {
            newHistory[NOSESSION_KEY] = currentHistory;
        }
        setHistory(newHistory);

        const newResponses = {...responses};
        if (currentSession.chatIsolation) {
            newResponses[currentSession.id] = currentChat;
        }
        else {
            newResponses[NOSESSION_KEY] = currentChat;
        }
        setResponses(newResponses);
    }
    const enqueueApiRequest = ({session, input, promptText}:enqueueApiRequestArgs) => {
        setApiFetchQueue((queue)=>{
            const newQueue = [...queue];
            newQueue.push({
                sessionid : session.id,
                input: input,
                note : session.note,
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
    
    return (
        <EventContext.Provider
            value={{
                createSession,
                deleteSession,
                changeCurrentSession,
                commitCurrentSession,
                enqueueApiRequest,
                changeFetchStatus,
                getFetchStatus
            }}
        >
            {children}
        </EventContext.Provider>
    )
}
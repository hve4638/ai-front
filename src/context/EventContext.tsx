import React, { useContext, useState } from "react";
import { createContext } from 'react';

import { IPromptInfomation, IPromptList, IPromptSubList } from "../features/prompts/interface.ts";
import { ChatSession } from "./interface.ts";
import { StoreContext } from "./StoreContext.tsx";
import { MemoryContext } from "./MemoryContext.tsx";

interface EventContextType {
    createSession:()=>void;
    deleteSession:(session:ChatSession)=>void;
    changeCurrentSession:(session:ChatSession)=>void;
    commitCurrentSession:()=>void;
}
const ANY:any = null;

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

const GLOBALTAG = "#GLOBAL";
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
    } = storeContext;
    const {
        currentHistory, setCurrentHistory,
        currentResponse, setCurrentResponse,
        currentSession, setCurrentSession,
        nextSessionID, setNextSessionID,
    } = memoryContext;

    const createSession = () => {
        const newSession = {...currentSession};
        newSession.id = nextSessionID;
        setNextSessionID(nextSessionID+1);
        
        setCurrentSession(newSession);
        setCurrentSessionId(newSession.id);

        const newSessions = [...sessions, newSession];
        setSessions(newSessions);
    }
    const deleteSession = (session) => {
        const newSessions = sessions.filter((s, index) => s.id !== session.id);
        setSessions(newSessions);
        if (currentSessionId == session.id) {
            const newSession = {...currentSession};
            newSession.id = -1;
            setCurrentSession(newSession);
            setCurrentSessionId(-1);
        }
    }
    const changeCurrentSession = (session) => {
        commitCurrentSession();
        
        if (session.chatIsolation) {
            setCurrentResponse(responses[session.id] ?? getDefaultAPIResponse());
        }
        else if (currentSession.chatIsolation) {
            setCurrentResponse(responses[GLOBALTAG] ?? getDefaultAPIResponse());
        }
        if (session.historyIsolation) {
            setCurrentHistory(history[session.id] ?? []);
        }
        else if (currentSession.historyIsolation) {
            setCurrentHistory(history[GLOBALTAG] ?? []);
        }
        
        setCurrentSessionId(session.id);
        setCurrentSession(session);

    }
    const commitCurrentSession = () => {
        if (currentSession === null) return;

        const newHistory = {...history};
        if (currentSession.historyIsolation) {
            newHistory[currentSession.id] = currentHistory;
        }
        else {
            newHistory[GLOBALTAG] = currentHistory;
        }
        setHistory(newHistory);

        const newResponses = {...responses};
        if (currentSession.chatIsolation) {
            newResponses[currentSession.id] = currentResponse;
        }
        else {
            newResponses[GLOBALTAG] = currentResponse;
        }
        setResponses(newResponses);
    }
    
    return (
        <EventContext.Provider
            value={{
                createSession,
                deleteSession,
                changeCurrentSession,
                commitCurrentSession
            }}
        >
            {children}
        </EventContext.Provider>
    )
}
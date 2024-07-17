import React, { useContext, useEffect, useState } from "react";
import { EventContext } from "../../context/EventContext.tsx";
import { MemoryContext } from "../../context/MemoryContext.tsx";

export function CleanUp() {
    const memoryContext = useContext(MemoryContext);
    const eventContext = useContext(EventContext);
    if (!memoryContext) throw new Error('<CleanUp/> required MemoryContextProvider');
    if (!eventContext) throw new Error('<CleanUp/> required EventContextProvider');
    const {
        commitCurrentSession,
    } = eventContext;
    const {
        historyManager,
    } = memoryContext;

    useEffect(()=>{
        return ()=>{
            commitCurrentSession();
            historyManager.close();
        }
    }, [])
}
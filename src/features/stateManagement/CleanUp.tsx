import React, { useContext, useEffect, useState } from "react";
import { EventContext } from "../../context/EventContext.tsx";

export function CleanUp() {
    const eventContext = useContext(EventContext);
    if (!eventContext) throw new Error('<CleanUp/> required EventContextProvider');
    const {
        commitCurrentSession,
    } = eventContext;

    useEffect(()=>{
        return ()=>{
            commitCurrentSession();
        }
    }, [])
}
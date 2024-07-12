import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/StoreContext.tsx";
import { PromptContext } from "../../context/PromptContext.tsx";
import { loadPrompt } from "../../services/local/index.ts";
import { MemoryContext } from "../../context/MemoryContext.tsx";
import { PromptSublist } from "../prompts/promptSublist.ts";
import { ChatSession } from "../../context/interface.ts";
import { EventContext } from "../../context/EventContext.tsx";

const ANY:any = {};

export function EffectHandler() {
    const promptContext = useContext(PromptContext);
    const storeContext = useContext(StoreContext);
    const memoryContext = useContext(MemoryContext);
    const eventContext = useContext(EventContext);
    if (!storeContext) throw new Error('<EffectHandler/> required PromptContextProvider');
    if (!promptContext) throw new Error('<EffectHandler/> required StoreContextProvider');
    if (!memoryContext) throw new Error('<EffectHandler/> required MemoryContextProvider');
    if (!eventContext) throw new Error('<EffectHandler/> required EventContextProvider');
    const [previousSession, setPreviousSession] = useState<ChatSession>(ANY);
    const [changeSessionTabPing, setChangeSessionTabPing] = useState(0);

    const {
        sessions,
        setSessions
    } = storeContext;
    const {
        promptList
    } = promptContext;
    const {
        currentSession,
        promptInfomation,
        setPromptIndex,
        setPromptInfomation,
        setPromptText,
        setPromptSubList,
        setApiSubmitPing,
    } = memoryContext;
    const {
        changeCurrentSession
    } = eventContext;

    useEffect(()=>{
        if (changeSessionTabPing === 0) {
            return;
        }
        
        if (sessions.length >= 2) {
            for (let i in sessions) {
                const session = sessions[i];
                if (session.id === currentSession.id) {
                    let nextIndex = Number(i);
                    if (changeSessionTabPing > 0) nextIndex++;
                    else nextIndex--;
                    if (nextIndex < 0) nextIndex += sessions.length;
                    nextIndex %= sessions.length;

                    const nextSession = sessions[nextIndex];
                    changeCurrentSession(nextSession);
                    setChangeSessionTabPing(0);
                }
            }
        }
    }, [changeSessionTabPing])

    useEffect(()=>{
        const handleKeyDown = (event) => {
            if (event.ctrlKey && event.key === 'Tab') {
                if (event.shiftKey) {
                    setChangeSessionTabPing((ping)=>ping-1);
                }
                else {
                    setChangeSessionTabPing((ping)=>ping+1);
                }
                event.preventDefault();
            }
            else if (event.ctrlKey && event.key === 'Enter') {
                setApiSubmitPing(true);
                event.preventDefault();
            }
        }
        window.addEventListener('keydown', handleKeyDown);
    
        return () => {
          window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    useEffect(()=>{
        if (currentSession.promptKey !== previousSession.promptKey) {
            const pl = promptList.getPrompt(currentSession.promptKey);
            const index = promptList.getPromptIndex(currentSession.promptKey);

            if (pl && index) {
                setPromptInfomation(pl);
                setPromptIndex(index);
                if (index.length > 1) {
                    const sublist = promptList.list[index[0]];
                    if (sublist instanceof PromptSublist) {
                        setPromptSubList(sublist);
                    }
                    else {
                        // 논리상 올 수 없음
                        console.error("Logic error")
                        setPromptSubList(null);
                    }
                }
                else {
                    setPromptSubList(null);
                }
            }
        }
        setPreviousSession(currentSession);
    }, [currentSession]);

    useEffect(()=>{
        if (promptInfomation) {
            loadPrompt(promptInfomation.value)
            .then((data)=>{
                setPromptText(data);
            })
            .catch((error)=>{
                console.error(error);
            })
        }
    }, [promptInfomation])

    useEffect(()=>{
        if (currentSession.id !== -1) {
            for (const i in sessions) {
                if (sessions[i].id === currentSession.id) {
                    const newSessions = [...sessions];
                    const newSession = {...currentSession};
                    newSession.id = currentSession.id;
                    newSessions[i] = newSession;
                    setSessions(newSessions);
                    break;
                }
            }
        }
    }, [currentSession])
}
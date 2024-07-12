import { memo, useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/StoreContext.tsx";
import { PromptContext } from "../../context/PromptContext.tsx";
import { loadPromptList } from "../../services/local/index.ts";
import { PromptList } from "../prompts/index.ts";
import { MemoryContext } from "../../context/MemoryContext.tsx";

export function Initializer({ onLoad }) {
    const [promptsLoaded, setPromptsLoaded] = useState(false);
    const [sessionLoaded, setSessionLoaded] = useState(false);
    const [promptLoaded, setPromptLoaded] = useState(false);
    const [storedValueLoaded, setStoredValueLoaded] = useState(false);
    const [nextSessionIDLoaded, setNextSessionIDLoaded] = useState(false);
    const promptContext = useContext(PromptContext);
    const storeContext = useContext(StoreContext);
    const memoryContext = useContext(MemoryContext);

    if (promptContext == null) throw new Error('<PromptContext/> required PromptContextProvider');
    if (storeContext == null) throw new Error('<StoreContext/> required StoreContextProvider');
    if (memoryContext == null) throw new Error('<StoreContext/> required StoreContextProvider');

    const {
        sessions,
        currentSessionId,
        history
    } = storeContext;
    const {
        promptList
    } = promptContext;
    const {
        currentSession,
        setPromptIndex,
        setCurrentSession,
        setPromptInfomation,
        setNextSessionID,
        setCurrentResponse
    } = memoryContext;
    
    useEffect(()=>{
        loadPromptList()
        .then(data => {
            const pl = new PromptList(data);
            promptContext.setPromptList(pl);
            setPromptsLoaded(true);
        })
        .catch(err => {
            console.error(err);
            setPromptsLoaded(true);
        })

        setCurrentResponse({
            input: '',
            output : '',
            prompt: '',
            note : {},
            tokens: 0,
            warning: null,
            error : null,
            finishreason : '',
            normalresponse : true,
        });
    }, []);

    useEffect(()=>{
        if (sessions === undefined) {
            // nothing to do
        }
        else if (sessions.length > 0) {
            let maxid:number = 0;
            for (const session of sessions) {
                const id = session.id;
                if (maxid < id+1) maxid = id+1;
            }
            setNextSessionID(maxid);
            setNextSessionIDLoaded(true);
        }
        else {
            setNextSessionID(0);
            setNextSessionIDLoaded(true);
        }
    },[sessions])

    useEffect(()=>{
        const defaultSession = {
            id : -1,
            historyIsolation : false,
            chatIsolation : false,
            color : null,
            modelCategory : "",
            model : "",
            note : {},
            promptKey : "",
            historyKey : "",
        };

        if (currentSessionId === undefined || sessions === undefined) {
            // nothing to do
        }
        else if (currentSessionId === null) {
            setCurrentSession(defaultSession);
            setSessionLoaded(true);
        }
        else {
            let notfound = true;
            for (const session of sessions) {
                if (session.id === currentSessionId) {
                    setCurrentSession(session);
                    notfound = false;
                    break;
                }
            }
            
            if (notfound) setCurrentSession(defaultSession);
            setSessionLoaded(true);
        }
    }, [currentSessionId, sessions]);

    useEffect(()=>{
        if (promptsLoaded && sessionLoaded) {
            const prompt = promptList.getPrompt(currentSession.promptKey);
            if (prompt) {
                const index = promptList.getPromptIndex(currentSession.promptKey) ?? [0];
                setPromptInfomation(prompt);
                setPromptIndex(index);
            }
            else {
                const firstPrompt = promptList.firstPrompt();
                const index = promptList.getPromptIndex(firstPrompt.key) ?? [0];
                setPromptInfomation(firstPrompt);
                setPromptIndex(index);
            }
            setPromptLoaded(true);
        }
    }, [promptsLoaded, sessionLoaded]);

    useEffect(()=>{
        if (currentSessionId !== undefined
            && sessions !== undefined
            && history !== undefined
        ) {
            setStoredValueLoaded(true);
        }
    }, [currentSessionId, sessions, history]);

    useEffect(()=>{
        if (promptsLoaded
            && sessionLoaded
            && promptLoaded
            && nextSessionIDLoaded
            && storedValueLoaded
        ) {
            onLoad();
        }
    }, [promptsLoaded, sessionLoaded, promptLoaded, nextSessionIDLoaded, storedValueLoaded]);
}

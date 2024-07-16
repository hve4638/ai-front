import { memo, useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/StoreContext.tsx";
import { PromptContext } from "../../context/PromptContext.tsx";
import { loadPromptList } from "../../services/local/index.ts";
import { PromptList } from "../prompts/index.ts";
import { MemoryContext } from "../../context/MemoryContext.tsx";
import { APIRESPONSE_TEMPLATE, NOSESSION_KEY, SESSION_TEMPLATE } from "../../data/constants.tsx";
import { AIModels } from "../chatAI/aimodels.ts";

export function Initializer({ onLoad }) {
    const [promptsLoaded, setPromptsLoaded] = useState(false);
    const [sessionLoaded, setSessionLoaded] = useState(false);
    const [promptLoaded, setPromptLoaded] = useState(false);
    const [storedValueLoaded, setStoredValueLoaded] = useState(false);
    const [nextSessionIDLoaded, setNextSessionIDLoaded] = useState(false);
    const [chatLoaded, setChatLoaded] = useState(false);
    const promptContext = useContext(PromptContext);
    const storeContext = useContext(StoreContext);
    const memoryContext = useContext(MemoryContext);

    if (promptContext == null) throw new Error('<PromptContext/> required PromptContextProvider');
    if (storeContext == null) throw new Error('<StoreContext/> required StoreContextProvider');
    if (memoryContext == null) throw new Error('<StoreContext/> required StoreContextProvider');

    const {
        sessions, setSessions,
        currentSessionId,
        history,
        responses,
        fontSize,
        layoutMode,
        nextSessionID,
        setNextSessionID,
    } = storeContext;
    const {
        promptList
    } = promptContext;
    const {
        currentSession,
        setPromptIndex,
        setCurrentSession,
        setPromptInfomation,
        currentChat, setCurrentChat
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
        });
    }, []);

    // 값 초기화 대기
    useEffect(()=>{
        if (
            currentSessionId !== undefined
            && sessions !== undefined
            && history !== undefined
            && responses !== undefined
            && fontSize !== undefined
            && layoutMode !== undefined
            && nextSessionID !== undefined
        ) {
            const rootElement = document.querySelector("html") ?? document.body;
            rootElement.style.fontSize = `${fontSize}px`;

            setStoredValueLoaded(true);
        }
    }, [currentSessionId, sessions, history, responses]);

    useEffect(()=>{
        if (!storedValueLoaded) return;
        
        if (sessions.length > 0) {
            let maxid:number = nextSessionID;
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
    }, [storedValueLoaded])

    useEffect(()=>{
        if (!storedValueLoaded || !promptsLoaded) return;
        

        const category = AIModels.getCategories()[0]
        const model = AIModels.getModels(category.value)[0];
        const defaultSession = {
            ...SESSION_TEMPLATE,
            modelCategory : category.value,
            modelName : model.value,
            promptKey : promptList.firstPrompt().key,
        } as const;

        if (currentSessionId === null) {
            setCurrentSession(defaultSession);
            setSessionLoaded(true);
        }
        else {
            let notfound = true;
            const newSessions:any[] = [];

            // 업데이트 후 session 포맷이 변경되었을 경우 재지정
            for (const session of sessions) {
                const newSession = {
                    ...defaultSession,
                    ...session,
                }
                newSessions.push(newSession);

                if (session.id === currentSessionId) {
                    setCurrentSession(newSession);
                    notfound = false;
                }
            }

            if (notfound) setCurrentSession(defaultSession);
            setSessions(newSessions);
            setSessionLoaded(true);
        }
    }, [storedValueLoaded, promptsLoaded]);

    useEffect(()=>{
        if (!storedValueLoaded || !sessionLoaded) return;

        let key;
        if (currentSession.chatIsolation) {
            key = currentSession.id;
        }
        else {
            key = NOSESSION_KEY;
        }
        
        if (key in responses) {
            setCurrentChat(responses[key]);
            setChatLoaded(true);
        }
        else {
            setCurrentChat({...APIRESPONSE_TEMPLATE});
            setChatLoaded(true);
        }
    }, [storedValueLoaded, sessionLoaded]);

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
        if (promptsLoaded
            && sessionLoaded
            && promptLoaded
            && nextSessionIDLoaded
            && storedValueLoaded
            && chatLoaded
        ) {
            onLoad();
        }
    }, [
        promptsLoaded, sessionLoaded, promptLoaded,
        nextSessionIDLoaded, storedValueLoaded, chatLoaded,
        
    ]);
}

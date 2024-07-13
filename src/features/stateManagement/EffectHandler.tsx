import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/StoreContext.tsx";
import { PromptContext } from "../../context/PromptContext.tsx";
import { loadPrompt } from "../../services/local/index.ts";
import { MemoryContext } from "../../context/MemoryContext.tsx";
import { PromptSublist } from "../prompts/promptSublist.ts";
import { ChatSession } from "../../context/interface.ts";
import { EventContext } from "../../context/EventContext.tsx";
import { AIModels } from "../chatAI/index.ts";
import { SecretContext } from "../../context/SecretContext.tsx";
import { NOSESSION_KEY } from "../../data/constants.tsx";

const ANY:any = {};

export function EffectHandler() {
    const secretContext = useContext(SecretContext);
    const promptContext = useContext(PromptContext);
    const storeContext = useContext(StoreContext);
    const memoryContext = useContext(MemoryContext);
    const eventContext = useContext(EventContext);
    if (!secretContext) throw new Error('<EffectHandler/> required SecretContextProvider');
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
        apiFetchBlock, setApiFetchBlock,
        apiFetchQueue, setApiFetchQueue,
        apiFetchResponse, setApiFetchResponse,
        currentChat, setCurrentChat,
        setCurrentHistory,
        setApiFetchWaiting
    } = memoryContext;
    const {
        changeCurrentSession
    } = eventContext;

    // Ctrl+Tab 핑
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

    // 단축키 핸들링
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

    // 선택된 prompt가 속한 sublist 찾기
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

    // 프롬프트 컨텐츠 로드
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

    // 휘발 세션이 아닌 현재 세션 정보를 sessions에 갱신
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

    // API Fetch 큐 처리
    useEffect(()=>{
        if (apiFetchBlock) return;
        if (apiFetchQueue.length === 0) return;

        const newApiFetchQueue = [...apiFetchQueue];
        const { sessionid, input, promptText } = newApiFetchQueue.shift();
    
        let targetSession:ChatSession;
        if (sessionid < 0) {
            targetSession = currentSession;
        }
        else {
            for (const session of sessions) {
                if (session.id === sessionid) {
                    targetSession = session;
                    break;
                }
            }
            targetSession ??= currentSession;
        }
        
        const sessionkey = (sessionid >= 0) ? sessionid : NOSESSION_KEY;
        const chatkey = targetSession.chatIsolation ? targetSession.id : NOSESSION_KEY;
        try {
            setApiFetchBlock(true);
            setApiFetchQueue(newApiFetchQueue);

            AIModels.request(
                {
                    contents: input,
                    note: targetSession.note,
                    prompt: promptText
                },
                {
                    secretContext,
                    storeContext
                }
            )
            .then(data=>{
                setApiFetchBlock(false);
                const res = {
                    success : true,
                    sessionid : sessionid,
                    data : data
                }
                
                setApiFetchResponse((responses)=>{
                    return {
                        ...responses,
                        [sessionkey] : res
                    };
                });
            })
            .catch(err=>{
                setApiFetchBlock(false);
                const res = {
                    success : false,
                    sessionid : sessionid,
                    data : {
                        input : input,
                        output : '',
                        prompt : promptText,
                        note : targetSession.note,
                        tokens: 0,
                        finishreason : 'EXCEPTION',
                        normalresponse : false,
                        warning : null,
                        error: `${err}`
                    }
                }
                
                setApiFetchResponse((responses)=>{
                    return {
                        ...responses,
                        [sessionkey] : res
                    };
                });
            });
        }
        catch(e) {
            setApiFetchBlock(false);
            setApiFetchWaiting((waiting)=>{
                const newWaiting = {...waiting};
                delete newWaiting[sessionkey];
                return newWaiting;
            })
        }
    }, [apiFetchBlock, apiFetchQueue]);

    useEffect(()=>{
        const updateApiFetchResponse = (key:any) => {
            const res = apiFetchResponse[key];

            if (res.success) {
                setCurrentHistory((history)=>{
                    const newhistory = [...history];
                    newhistory.push(res.data);
                    return newhistory;
                });
            }
            setCurrentChat({...res.data, input : currentChat.input});
            
            setApiFetchWaiting((waiting)=>{
                const newWaiting = {...waiting};
                delete newWaiting[key];
                return newWaiting;
            })

            setApiFetchResponse(oldApiFetchResponse=>{
                const newApiFetchResponse = {...oldApiFetchResponse}
                delete newApiFetchResponse[key];
                return newApiFetchResponse;
            });
        }
        
        if (currentSession.chatIsolation && currentSession.id in apiFetchResponse) {
            updateApiFetchResponse(currentSession.id);
        }
        else if (!currentSession.chatIsolation && NOSESSION_KEY in apiFetchResponse) {
            updateApiFetchResponse(NOSESSION_KEY);
        }
    }, [apiFetchResponse, currentSession])
}
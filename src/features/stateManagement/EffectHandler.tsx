import { useContext, useEffect, useState } from 'react'
import { NOSESSION_KEY } from 'data/constants'
import { FetchStatus } from 'data/interface'
import { loadPrompt, LocalInteractive } from 'services/local'
import { StoreContext } from 'context/StoreContext'
import { PromptContext } from 'context/PromptContext'
import { MemoryContext } from 'context/MemoryContext'
import { EventContext } from 'context/EventContext'
import { SecretContext } from 'context/SecretContext'
import { ChatSession } from 'context/interface'
import { AIModelFetchManager } from './aiModelFetchManager'
import { PromptMetadataSublist } from 'features/prompts/promptMetadataSublist'

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
    const [changeSessionMovePing, setChangeSessionMovePing] = useState<number|null>(null);
    const [wheelPing, setWheelPing] = useState(0);
    const [aiModelFetchManager, setAIModelFetchManager] = useState(new AIModelFetchManager());

    const {
        sessions, setSessions,
        fontSize, setFontSize,
        isGlobalHistoryVolatile
    } = storeContext;
    const {
        promptList
    } = promptContext;
    const {
        currentSession,
        setPromptText,
        setApiSubmitPing,
        apiFetchQueue, setApiFetchQueue,
        apiFetchResponse, setApiFetchResponse,
        currentChat, setCurrentChat,
        setCurrentHistory,
        historyManager
    } = memoryContext;
    const {
        changeCurrentSession,
        changeFetchStatus,
    } = eventContext;

    // Ctrl+숫자 핑
    useEffect(()=>{
        if (changeSessionMovePing == null) return;
        
        const index = changeSessionMovePing - 1;
        if (index < sessions.length) {
            const nextSession = sessions[index];
            changeCurrentSession(nextSession);
        }

        setChangeSessionMovePing(null);
    }, [changeSessionMovePing])

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

    // Ctrl+Wheel 핑
    useEffect(()=>{
        if (wheelPing === 0) return;

        const rootElement = document.querySelector('html');
        if (rootElement != null) {
            let num;
            num = fontSize+wheelPing;
            rootElement.style.fontSize = `${num}px`;
            setFontSize(num);
            setWheelPing(0);
        }
    }, [wheelPing])

    // 단축키 핸들링
    useEffect(()=>{
        const handleKeyDown = (event) => {
            if (event.ctrlKey) {
                if (event.key === 'Tab') {
                    if (event.shiftKey) {
                        setChangeSessionTabPing((ping)=>ping-1);
                    }
                    else {
                        setChangeSessionTabPing((ping)=>ping+1);
                    }
                    event.preventDefault();
                }
                else if (event.key === 'Enter') {
                    setApiSubmitPing(true);
                    event.preventDefault();
                }
                else {
                    for (let i = 1; i < 10; i++) {
                        if (event.key === String(i)) {
                            setChangeSessionMovePing(i);
                            event.preventDefault();
                        }
                    }
                }
            }
        }
        window.addEventListener('keydown', handleKeyDown);
    
        return () => {
          window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    // 휠 핸들링
    useEffect(()=>{
        const handleWheel = (event)=>{
            if (event.ctrlKey) {
                setWheelPing(ping=>ping-Math.sign(event.deltaY))
                event.preventDefault();
            }
        }

        document.addEventListener('wheel', handleWheel, {passive:false});
        return () => {
          window.removeEventListener('wheel', handleWheel);
        };
    }, []);

    // 선택된 prompt가 속한 sublist 찾기
    useEffect(()=>{
        if (currentSession.promptKey !== previousSession.promptKey) {
            const metadata = memoryContext.promptMetadataTree.getPrompt(currentSession.promptKey);

            if (metadata) {
                const indexes = metadata.indexes;

                memoryContext.setPromptMetadata(metadata);
                const sublist = memoryContext.promptMetadataTree.list[indexes[0]];
                if (sublist instanceof PromptMetadataSublist) {
                    memoryContext.setPromptMetadataSublist(sublist);
                }
                else {
                    memoryContext.setPromptMetadataSublist(null);
                }
            }
        }
        setPreviousSession(currentSession);
    }, [currentSession]);

    
    useEffect(()=>{
        historyManager.setHistoryVolatile(NOSESSION_KEY, isGlobalHistoryVolatile);
    }, [isGlobalHistoryVolatile]);

    // 프롬프트 컨텐츠 로드
    useEffect(()=>{
        if (memoryContext.promptMetadata) {
            memoryContext.promptMetadata.loadPromptTemplate();
        }
    }, [ memoryContext.promptMetadata ])

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
        if (apiFetchQueue.length === 0) return;

        const newApiFetchQueue = [...apiFetchQueue];
        const { sessionid, input, promptText } = newApiFetchQueue.shift();
        setApiFetchQueue(newApiFetchQueue);
    
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
        
        changeFetchStatus(targetSession, FetchStatus.QUEUED);
        const sessionkey = (sessionid >= 0 && targetSession.chatIsolation) ? sessionid : NOSESSION_KEY;
        aiModelFetchManager.enqueueAPIRequest({
            onFetchStart: ()=>{
                changeFetchStatus(targetSession, FetchStatus.PROCESSING);
            },
            onFetchComplete : (success, data)=>{
                if (success) {
                    changeFetchStatus(targetSession, FetchStatus.COMPLETE);
                }
                else {
                    changeFetchStatus(targetSession, FetchStatus.ERROR);
                }
                
                setApiFetchResponse((responses)=>{
                    return {
                        ...responses,
                        [sessionkey] : {
                            success : success,
                            sessionid : sessionkey,
                            data : data
                        }
                    };
                });
            },
            args : {
                contents : input,
                note: targetSession.note,
                prompt: promptText,
                modelCategory: targetSession.modelCategory,
                modelName: targetSession.modelName,
                secretContext
            }
        });
    }, [apiFetchQueue]);

    // 현 세션의 응답 처리
    useEffect(()=>{
        const updateApiFetchResponse = (key:any) => {
            const res = apiFetchResponse[key];
            if (res.success) {
                historyManager.insert(currentSession, res.data);

                setCurrentHistory((history)=>{
                    const newhistory = [...history];
                    newhistory.push(res.data);
                    return newhistory;
                });
            }
            setCurrentChat({...res.data, input : currentChat.input});
            
            setApiFetchResponse(oldApiFetchResponse=>{
                const newApiFetchResponse = {...oldApiFetchResponse}
                delete newApiFetchResponse[key];
                return newApiFetchResponse;
            });
        }
        
        if (currentSession.chatIsolation && currentSession.id in apiFetchResponse) {
            updateApiFetchResponse(currentSession.id);
            changeFetchStatus(currentSession, FetchStatus.IDLE);

        }
        else if (!currentSession.chatIsolation && NOSESSION_KEY in apiFetchResponse) {
            updateApiFetchResponse(NOSESSION_KEY);
        }
    }, [apiFetchResponse, currentSession])
}
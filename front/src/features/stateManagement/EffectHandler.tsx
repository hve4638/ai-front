import React, { memo, useContext, useEffect, useState } from 'react'
import { NOSESSION_KEY } from 'data/constants'
import { FetchStatus } from 'data/interface'
import LocalAPI from 'api'

import {
    StoreContext,
    MemoryContext,
    EventContext,
    SecretContext,
    useContextForce,
} from "context";

import { ChatSession } from 'context/interface'
import { AIModelFetchManager } from './aiModelFetchManager'

const ANY: any = {};

export function EffectHandler() {
    const secretContext = useContextForce(SecretContext);
    const storeContext = useContextForce(StoreContext);
    const memoryContext = useContextForce(MemoryContext);
    const eventContext = useContextForce(EventContext);

    const [previousSession, setPreviousSession] = useState<ChatSession>(ANY);
    const [aiModelFetchManager, setAIModelFetchManager] = useState(new AIModelFetchManager());

    const {
        apiFetchQueue, setApiFetchQueue,
        apiFetchResponse, setApiFetchResponse,
        historyManager
    } = memoryContext;

    // CleanUp 프로세스
    useEffect(() => {
        const handleBeforeUnload = (event) => {
            /*
                현 세션 정보를 history, response에 반영
                마지막 지정한 prompt 변수를 lastvar에 반영
            */
            eventContext.commitCurrentSession();
            eventContext.commitPromptMetdataVariable(memoryContext.currentPromptMetadata);
            memoryContext.historyManager.close();
        };
        
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [
        memoryContext.historyManager,
        memoryContext.currentPromptMetadata,
        memoryContext.currentSession
    ]);

    // 전역 History 휘발성 여부 반영
    useEffect(() => {
        historyManager.setHistoryVolatile(NOSESSION_KEY, storeContext.isGlobalHistoryVolatile);
    }, [storeContext.isGlobalHistoryVolatile]);

    // 프롬프트 컨텐츠 로드
    useEffect(() => {
        if (memoryContext.currentPromptMetadata) {
            memoryContext.currentPromptMetadata.loadPromptTemplate({
                onFail: (err) => {
                    eventContext.addErrorLog(err.name, err.message);
                }
            });
        }
    }, [memoryContext.currentPromptMetadata])

    // 휘발 세션이 아닌 현재 세션 정보를 sessions에 반영
    useEffect(() => {
        const { sessions } = storeContext;

        if (currentSession.id !== -1) {
            for (const i in sessions) {
                if (sessions[i].id === currentSession.id) {
                    const newSessions = [...sessions];
                    const newSession = { ...currentSession };
                    newSession.id = currentSession.id;
                    newSessions[i] = newSession;
                    storeContext.setSessions(newSessions);
                    break;
                }
            }
        }
    }, [currentSession])

    // API Fetch 큐 처리
    useEffect(() => {
        const { sessions } = storeContext;

        const newApiFetchQueue = [...apiFetchQueue];
        const element = newApiFetchQueue.shift();

        if (element == null) return;
        setApiFetchQueue(newApiFetchQueue);

        const { sessionid, input, promptMetadata } = element;
        const promptText = promptMetadata.promptTemplate;

        let targetSession: ChatSession;
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

        eventContext.changeFetchStatus(targetSession, FetchStatus.QUEUED);
        const sessionkey = (sessionid >= 0 && targetSession.chatIsolation) ? sessionid : NOSESSION_KEY;
        aiModelFetchManager.enqueueAPIRequest({
            onFetchStart: () => {
                eventContext.changeFetchStatus(targetSession, FetchStatus.PROCESSING);
            },
            onFetchComplete: (success, data) => {
                if (success) {
                    eventContext.changeFetchStatus(targetSession, FetchStatus.COMPLETE);
                }
                else {
                    eventContext.changeFetchStatus(targetSession, FetchStatus.ERROR);
                }

                setApiFetchResponse((responses) => {
                    return {
                        ...responses,
                        [sessionkey]: {
                            success: success,
                            sessionid: sessionkey,
                            data: data
                        }
                    };
                });
            },
            args: {
                contents: input,
                note: targetSession.note,
                prompt: promptText,
                modelCategory: targetSession.modelCategory,
                modelName: targetSession.modelName,
                secretContext
            }
        });
    }, [apiFetchQueue]);

    // 현 세션의 응답 처리
    useEffect(() => {
        const updateApiFetchResponse = (key: any) => {
            const res = apiFetchResponse[key];
            if (res.success) {
                historyManager.insert(currentSession, res.data);

                setCurrentHistory((history) => {
                    const newhistory = [...history];
                    newhistory.push(res.data);
                    return newhistory;
                });
            }
            setCurrentChat({ ...res.data, input: currentChat.input });

            setApiFetchResponse(oldApiFetchResponse => {
                const newApiFetchResponse = { ...oldApiFetchResponse }
                delete newApiFetchResponse[key];
                return newApiFetchResponse;
            });
        }

        if (currentSession.chatIsolation && currentSession.id in apiFetchResponse) {
            updateApiFetchResponse(currentSession.id);
            eventContext.changeFetchStatus(currentSession, FetchStatus.IDLE);
        }
        else if (!currentSession.chatIsolation && NOSESSION_KEY in apiFetchResponse) {
            updateApiFetchResponse(NOSESSION_KEY);
        }
    }, [apiFetchResponse, currentSession]);

    useEffect(() => {
        console.log(memoryContext.errorLogs.at(-1));
    }, [memoryContext.errorLogs]);
}
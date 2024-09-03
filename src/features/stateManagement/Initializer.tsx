import React, { memo, useContext, useEffect, useState } from 'react';

import { APIRESPONSE_TEMPLATE, NOSESSION_KEY, SESSION_TEMPLATE } from 'data/constants';
import { StoreContext, MemoryContext, PromptContext, EventContext, useContextForce } from 'context';
import { LocalInteractive } from 'services/local';

import { IPromptMetadata, PromptMetadata, PromptMetadataTree, PromptMetadataVerifier } from 'features/prompts';
import { AIModels } from 'features/chatAI';
import { PROMPT_METADATA_PARSE_ERRORS, PromptMetadataParseError } from 'features/prompts/errors';
import { RawPromptMetadataElement } from 'features/prompts/types';

type InitializerProps = {
    onLoad:()=>void,
    onLoadFail:(reason:string, detail:string)=>void,
    historyManager:any,
}

export function Initializer({ onLoad=()=>{}, onLoadFail, historyManager }:InitializerProps) {
    const storeContext = useContextForce(StoreContext);
    const memoryContext = useContextForce(MemoryContext);
    const eventContext = useContextForce(EventContext);

    const [isLoadTooLong, setIsLoadTooLong] = useState(false);

    const [initialized, setInitialized] = useState(false);
    const [promptMetadataLoaded, setPromptMetadataLoaded] = useState(false);
    const [sessionLoaded, setSessionLoaded] = useState(false);
    const [promptLoaded, setPromptLoaded] = useState(false);
    const [storedValueLoaded, setStoredValueLoaded] = useState(false);
    const [nextSessionIDLoaded, setNextSessionIDLoaded] = useState(false);
    const [chatLoaded, setChatLoaded] = useState(false);
    const [varLoaded, setVarLoaded] = useState(false);

    const {
        sessions,
        currentSessionId,
        history,
        responses,
        fontSize,
        layoutMode,
        nextSessionID,
        lastvar,
    } = storeContext;
    const {
        currentSession,
        promptMetadataTree,
    } = memoryContext;

    // 로딩이 너무 오래 걸릴경우 현재 로딩 상태를 표시
    useEffect(()=>{
        const timeout = setTimeout(()=>{
            setIsLoadTooLong(true);
        }, 5000);

        return ()=>{
            clearTimeout(timeout);
        }
    })

    useEffect(()=>{
        memoryContext.setHistoryManager(historyManager);

        setInitialized(true);
    }, [])
    
    // PromptMetadataTree 로드 및 초기화
    useEffect(()=>{
        const initializePromptMetadata = async () => {
            let rootContents:string;
            rootContents = await LocalInteractive.loadPromptMetadata("list.json");

            if (rootContents.startsWith('@FAIL')) {
                onLoadFail('프롬프트 로딩 실패 : list.json', rootContents);
                return;
            }

            try {
                const verifier = new PromptMetadataVerifier();
    
                const [rawTree, modules] = verifier.parsePromptMetadataTree(rootContents);
                
                const externalPromptMetadata:{
                    [key:string]:RawPromptMetadataElement
                } = {};
                
                for (const moduleName of modules) {
                    if (!moduleName.match(/\w+/)) {
                        throw new PromptMetadataParseError(
                            'Invalid Module Name',
                            {
                                errorType: PROMPT_METADATA_PARSE_ERRORS.INVALID_MODULE_NAME,
                                target: `module name : ${moduleName}`,
                            }
                        )
                    }
                    
                    const moduleContent = await LocalInteractive.loadPromptMetadata(moduleName + "/index.json");
                    if (moduleContent.startsWith('@FAIL')) {
                        throw new PromptMetadataParseError(
                            'PromptMetadata Load Failed',
                            {
                                errorType: PROMPT_METADATA_PARSE_ERRORS.INVALID_MODULE_NAME,
                                target: `module name : ${moduleName}\n\n${moduleContent}`,
                            }
                        )
                    }
                    
                    const metadata = verifier.parseModulePromptMetadata(moduleContent);
                    externalPromptMetadata[moduleName] = metadata;
                }
                
                const tree = new PromptMetadataTree(rawTree, externalPromptMetadata);
                memoryContext.setPromptMetadataTree(tree);
                
                setPromptMetadataLoaded(true);
            }
            catch(e:unknown) {
                if (e instanceof PromptMetadataParseError) {
                    onLoadFail(
                        `PromptMetadata Parse Failed :: ${e.extraInfomation?.errorType}`,
                        `${e.message}\n\n${e.extraInfomation?.target ?? ''}`
                    );
                }
                else if (e instanceof Error) {
                    onLoadFail(
                        `PromptMetadata Parse Failed (${e.name})`,
                        `${e.message}\n\n${e.stack}`
                    );
                }
                else {
                    onLoadFail('PromptMetadata Parse Failed', (e as any).toString());
                }
                return;
            }
        }

        initializePromptMetadata();
    }, []);

    // storeContext 값 로딩 대기
    useEffect(()=>{
        if (
            currentSessionId !== undefined
            && sessions !== undefined
            && history !== undefined
            && responses !== undefined
            && fontSize !== undefined
            && layoutMode !== undefined
            && nextSessionID !== undefined
            && lastvar !== undefined
        ) {
            const rootElement = document.querySelector("html") ?? document.body;
            rootElement.style.fontSize = `${fontSize}px`;

            setStoredValueLoaded(true);
        }
    }, [currentSessionId, sessions, history, responses, fontSize, layoutMode, nextSessionID, lastvar]);

    // NextSessionID 초기화
    useEffect(()=>{
        if (!storedValueLoaded) return;
        
        if (sessions.length > 0) {
            let maxid:number = nextSessionID;
            for (const session of sessions) {
                const id = session.id;
                if (maxid < id+1) maxid = id+1;
            }
            storeContext.setNextSessionID(maxid);
        }
        else {
            storeContext.setNextSessionID(0);
        }

        setNextSessionIDLoaded(true);
    }, [storedValueLoaded])

    // 세션 초기화
    useEffect(()=>{
        if (!storedValueLoaded || !promptMetadataLoaded) return;
        
        const category = AIModels.getCategories()[0]
        const model = AIModels.getModels(category.value)[0];
        const defaultSession = {
            ...SESSION_TEMPLATE,
            modelCategory : category.value,
            modelName : model.value,
            promptKey : promptMetadataTree.firstPromptMetadata().key,
        } as const;

        if (currentSessionId === null) {
            memoryContext.setCurrentSession(defaultSession);
            setSessionLoaded(true);
        }
        else {
            let notfound = true;
            const newSessions:any[] = [];

            // 업데이트로 session 포맷이 변경된 경우 처리
            for (const session of sessions) {
                const newSession = {
                    ...defaultSession,
                    ...session,
                }
                newSessions.push(newSession);

                if (session.id === currentSessionId) {
                    memoryContext.setCurrentSession(newSession);
                    notfound = false;
                }
            }

            if (notfound) memoryContext.setCurrentSession(defaultSession);
            storeContext.setSessions(newSessions);
            setSessionLoaded(true);
        }
    }, [storedValueLoaded, promptMetadataLoaded]);

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
            memoryContext.setCurrentChat(responses[key]);
            setChatLoaded(true);
        }
        else {
            memoryContext.setCurrentChat({...APIRESPONSE_TEMPLATE});
            setChatLoaded(true);
        }
    }, [storedValueLoaded, sessionLoaded]);

    // 각 PromptMetadata의 마지막 변수 값 로드
    useEffect(()=>{
        if (promptMetadataLoaded && storedValueLoaded) {
            const tree = memoryContext.promptMetadataTree;

            for (const key in lastvar) {
                const prompt = tree.getPromptMetadata(key);
                if (prompt) {
                    prompt.setVarValues(lastvar[key]);
                }
            }
            setVarLoaded(true);
        }
    }, [promptMetadataLoaded, storedValueLoaded]);

    // 현재 Session을 기반으로 PromptMetadata 지정
    useEffect(()=>{
        if (!promptMetadataLoaded || !sessionLoaded || !varLoaded) return;

        let metadata = memoryContext.promptMetadataTree.getPromptMetadata(currentSession.promptKey);
        metadata ??= memoryContext.promptMetadataTree.firstPromptMetadata();
        eventContext.setCurrentPromptMetadata(metadata, true);
        
        setPromptLoaded(true);
    }, [promptMetadataLoaded, sessionLoaded, varLoaded]);

    useEffect(()=>{
        if (initialized
            && promptMetadataLoaded
            && sessionLoaded
            && promptLoaded
            && nextSessionIDLoaded
            && storedValueLoaded
            && chatLoaded
            && varLoaded
        ) {
            onLoad();
        }
    }, [
        promptMetadataLoaded, sessionLoaded, promptLoaded,
        nextSessionIDLoaded, storedValueLoaded, chatLoaded,
        varLoaded
    ]);

    return (
        <div className='loader-container undraggable'>
            <div className='row' style={{padding:'16px', alignItems: 'center'}}>
                <span className='loader-text'>loading...</span>
                <div className='loader'></div>
            </div>
            {
                isLoadTooLong &&
                <div className='column loaded-list'  style={{padding:'16px'}}>
                    <span className={initialized ? 'loaded' : 'loading'}>Initialized</span>
                    <span className={promptMetadataLoaded ? 'loaded' : 'loading'}>Prompts load</span>
                    <span className={storedValueLoaded ? 'loaded' : 'loading'}>Cookie load</span>
                    <span className={sessionLoaded ? 'loaded' : 'loading'}>Session load</span>
                    <span className={nextSessionIDLoaded ? 'loaded' : 'loading'}>SessionID validation</span>
                    <span className={chatLoaded ? 'loaded' : 'loading'}>Chat load</span>
                    <span className={promptLoaded ? 'loaded' : 'loading'}>Prompt load</span>
                    <span className={varLoaded ? 'loaded' : 'loading'}>Var load</span>
                </div>
            }
        </div>
    )
}

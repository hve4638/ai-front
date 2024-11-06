import React, { useState, createContext } from 'react';
import { useContextForce } from './index.ts';
import { ProfileContext } from './ProfileContext.tsx';
import { MemoryContext } from './MemoryContext.tsx';

import { defaultChatInput } from 'data/chat';
import { defaultLLMAPIResponse } from 'data/llmapi';
import { ANY } from './types';

import type { IPromptMetadata } from 'features/prompts';
import type { LLMAPIResponse, PromptVariables } from 'types/llmapi';
import type { ChatInput, ChatSession } from 'types/chat';
import type { SetState } from './types';

interface SessionContextType {
    input: ChatInput;
    setInput: SetState<ChatInput>;
    lastResponse: LLMAPIResponse;
    setLastResponse: SetState<LLMAPIResponse>;
    responseHistory: LLMAPIResponse[];
    setResponseHistory: SetState<LLMAPIResponse[]>;
    promptMetadata: IPromptMetadata;
    setPromptMetadata: SetState<IPromptMetadata>;
    color: string|null;
    setColor: SetState<string|null>;
    modelKey: string;
    setModelKey: SetState<string>;
    sessionId: number;
    setSessionId: SetState<number>;

    chatIsolation: boolean;
    setChatIsolation: SetState<boolean>;
    historyIsolation: boolean;
    setHistoryIsolation: SetState<boolean>;


    /** ChatSession으로부터 세션 정보 가져옴 */
    importSession: (session:ChatSession) => void;
    /** 현 세션 정보를 ChatSession 포맷으로 내보냄 */
    exportSession: () => ChatSession;
}

export const SessionContext = createContext<SessionContextType|null>(null);

export default function SessionContextProvider({children}) {
    const memoryContext = useContextForce(MemoryContext);
    const profileContext = useContextForce(ProfileContext);
    const [input, setInput] = useState<ChatInput>(defaultChatInput);
    const [lastResponse, setLastResponse] = useState<LLMAPIResponse>(defaultLLMAPIResponse);
    const [responseHistory, setResponseHistory] = useState<LLMAPIResponse[]>([]);
    const [promptMetadata, setPromptMetadata] = useState<IPromptMetadata>(ANY);
    const [color, setColor] = useState<string|null>(null);
    const [modelKey, setModelKey] = useState<string>(ANY);
    const [sessionId, setSessionId] = useState<number>(-1);
    const [chatIsolation, setChatIsolation] = useState<boolean>(true);
    const [historyIsolation, setHistoryIsolation] = useState<boolean>(true);

    const contextValues:SessionContextType = {
        input, setInput,
        lastResponse, setLastResponse,
        responseHistory, setResponseHistory,
        promptMetadata, setPromptMetadata,
        color, setColor,
        modelKey, setModelKey,
        sessionId, setSessionId,
        chatIsolation, setChatIsolation,
        historyIsolation, setHistoryIsolation,

        importSession(session:ChatSession) {
            const lastChat = profileContext.lastChats[session.id];
            setInput(lastChat?.chatInput ?? defaultChatInput);
            setLastResponse(lastChat?.chatResponse ?? defaultLLMAPIResponse);

            const pmTree = memoryContext.promptMetadataTree;
            const pm = pmTree.getPromptMetadata(session.promptKey) ?? pmTree.firstPromptMetadata();
            const pmCopy = pmTree.getPromptMetadata(session.promptKey) ?? pmTree.firstPromptMetadata();
            pmCopy.setVarValues(session.note);
            setPromptMetadata(pmCopy);

            // TODO: responseHistory 초기화 필요
            setResponseHistory([]);
        },
        exportSession():ChatSession {
            return {
                id: sessionId,
                promptKey: promptMetadata.key,
                note: promptMetadata.getVarValues(),
                modelCategory: modelKey.split('/')[0],
                modelName: modelKey.split('/')[1],
                color: color,
                historyKey: '',
                historyIsolation: historyIsolation,
                chatIsolation: chatIsolation
            }
        }
    }

    return (
        <SessionContext.Provider
            value={contextValues}
        >
            {children}
        </SessionContext.Provider>
    )
}
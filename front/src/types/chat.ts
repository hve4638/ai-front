import type { LLMAPIResponse, PromptVariables } from './llmapi';

export const ChatInputType = {
    NORMAL: 'NORMAL',
} as const;
export type ChatInputType = typeof ChatInputType[keyof typeof ChatInputType];

export interface ChatInput {
    chatType : 'NORMAL';
    text : string;
}

export interface ChatSession {
    id:number;
    promptKey:string;
    note:PromptVariables;
    modelCategory:string;
    modelName:string;
    color:string|null;
    historyKey:string;
    historyIsolation:boolean;
    chatIsolation:boolean;
}

export type LastChats = {
    [sessionId:number]:LastChat
}

export interface LastChat {
    chatInput: ChatInput;
    chatResponse: LLMAPIResponse;
}
import type { ChatInput, ChatSession } from 'types/chat';

export const defaultChatInput:ChatInput = {
    chatType: 'NORMAL',
    text: ''
} as const;

export const defaultChatSession:ChatSession = {
    id: -1,
    promptKey: '',
    note: {},
    modelCategory: '',
    modelName: '',
    color: null,
    historyKey: '',
    historyIsolation: false,
    chatIsolation: false
} as const;
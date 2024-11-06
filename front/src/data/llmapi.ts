import type { LLMAPIResponse } from 'types/llmapi';

export const defaultLLMAPIResponse:LLMAPIResponse = {
    input : '',
    output : '',
    prompt : '',
    note : {},
    tokens : 0,
    finishreason : '',
    warning : '',
    normalresponse : true,
    error : ''
} as const;
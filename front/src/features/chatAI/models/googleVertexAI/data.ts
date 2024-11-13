import { ChatRole } from '../../types/request-form';
export const VERTEXAI_URL = 'https://{{location}}-aiplatform.googleapis.com/v1/projects/{{projectid}}/locations/{{location}}/publishers/anthropic/models/{{model}}:rawPredict'

export const ROLE_DEFAULT = 'USER';
export const ROLE = {
    [ChatRole.USER] : 'user',
    [ChatRole.SYSTEM] : 'system',
    [ChatRole.BOT] : 'assistant',
} as const;
export type ROLE = typeof ROLE[keyof typeof ROLE];
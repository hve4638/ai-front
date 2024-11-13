import { ChatRole } from '../../types/request-form';
export const CLAUDE_URL = 'https://api.anthropic.com/v1/messages';

export const ROLE_DEFAULT = 'user';
export const ROLE = {
  [ChatRole.USER] : 'user',
  [ChatRole.SYSTEM] : 'system',
  [ChatRole.BOT] : 'assistant',
} as const;
export type ROLE = typeof ROLE[keyof typeof ROLE];
import { ChatRole } from '../../types/request-form';

export const OPENAI_GPT_URL = 'https://api.openai.com/v1/chat/completions';

export const ROLE_DEFAULT = 'USER';
export const ROLE = {
  [ChatRole.USER] : 'user',
  [ChatRole.SYSTEM] : 'system',
  [ChatRole.BOT] : 'assistant',
}
export type ROLE = typeof ROLE[keyof typeof ROLE];
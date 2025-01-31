export const PromptInputType = {
    NORMAL: 'NORMAL',
    CHAT: 'CHAT',
} as const;
export type PromptInputType = (typeof PromptInputType)[keyof typeof PromptInputType];
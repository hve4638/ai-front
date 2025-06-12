export const PromptInputType = {
    NORMAL: 'normal',
    CHAT: 'chat',
} as const;
export type PromptInputType = (typeof PromptInputType)[keyof typeof PromptInputType];
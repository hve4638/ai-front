export const PageType = {
    HOME : 'HOME',
    PROMPT_EDITOR : 'PROMPT_EDITOR',
} as const;
export type PageType = typeof PageType[keyof typeof PageType];

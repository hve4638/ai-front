export const PromptEditAction = {
    NEW : 'NEW',
    EDIT : 'EDIT',
} as const;
export type PromptEditAction = typeof PromptEditAction[keyof typeof PromptEditAction];

export const PromptEditMode = {
    PromptOnly : 'PROMPT_ONLY',
    Flow : 'FLOW',
} as const;
export type PromptEditMode = typeof PromptEditMode[keyof typeof PromptEditMode];

export const PromptEditAction = {
    NEW : 'NEW',
    EDIT : 'EDIT',
}
export type PromptEditAction = typeof PromptEditAction[keyof typeof PromptEditAction];

export const PromptEditMode = {
    NORMAL : 'NORMAL',
    FLOW : 'FLOW',
}
export type PromptEditMode = typeof PromptEditMode[keyof typeof PromptEditMode];

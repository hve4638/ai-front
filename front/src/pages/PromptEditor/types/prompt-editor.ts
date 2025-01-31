export const PromptEditMode = {
    NEW : 'NEW',
    EDIT : 'EDIT',
    VIEW : 'VIEW',
}
export type PromptEditMode = typeof PromptEditMode[keyof typeof PromptEditMode];
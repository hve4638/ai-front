export interface VarItem {
    name:string,
    value:string
}

export type Vars = Map<string, VarItem[]>

export interface NoteItem {
    name : string,
    value : string
}

export interface MainPromptsType {
    name: string,
    value: string,
    path: string|undefined,
    key: string,
    list: SubPromptsType[]|undefined,
    vars: string[]|undefined,
}

export interface SubPromptsType {
    name: string,
    value: string,
    key: string,
    vars: string[]|undefined,
}

export interface PromptInfoType {
    name: string,
    value: string
}
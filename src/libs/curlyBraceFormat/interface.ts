export interface CurlyBraceFormatItem {
    build:(x:CurlyBraceFormatBuildArgs)=>any
}

export interface VarNote {
    [key:string] : string
}

export interface CurlyBraceFormatBuildArgs {
    vars: VarNote
    role? : (rawrole:string)=>string,
    map? : (text:string, role:string)=>any
}
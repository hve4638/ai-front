export interface VarStruct {
    value:string;
    array:any
    fields:{[key:string]:any};
    functions:{[key:string]:any};
}

export interface CurlyBraceFormatItem {
    //build:(x:CurlyBraceFormatBuildArgs)=>any
}

export interface VarNote {
    [key:string] : VarStruct
}

export interface CurlyBraceFormatBuildArgs {
    vars: VarNote,
    reservedVars : VarNote,
    role? : (rawrole:string)=>string,
    map? : (text:string, role:string)=>any
}z
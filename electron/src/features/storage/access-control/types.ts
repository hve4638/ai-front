import { IAccessor } from "../accessor";

export const StorageAccess = {
    NOTHING : 0b0000,
    DIR     : 0b0001,
    BINARY  : 0b0010,
    TEXT    : 0b0100,
    JSON    : 0b1000,

    ANY : 0b11111111_11111111_11111111_11111111,
} as const;
export type StorageAccess = number;
export const NEXT_STORAGE_ACCESS_TYPE_BIT = 0b0001_0000;

export type AccessTree = {
    [key:string]:AccessTree|StorageAccess;
    '*'? : AccessTree|StorageAccess,
    '**/*'? : StorageAccess,
    ''? : never,
    ':'? : never,
}

export type StorageAccessControlEvent = {
    onAccess:(identifier:string, accessType:StorageAccess)=>IAccessor,
    onAccessDir:(identifier:string)=>void,
    onRelease:(identifier:string)=>void,
    onReleaseDir:(identifier:string)=>void,
}
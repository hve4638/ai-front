export const MasterKeyInitResult = {
    Normal : 0,
    NormalWithWarning : 1,
    NoData : -1,
    InvalidData : -2,
    NeedRecovery : -3,
    UnexpectedError : -4,
} as const;
export type MasterKeyInitResult = typeof MasterKeyInitResult[keyof typeof MasterKeyInitResult];


export interface IMasterKeyGettable {
    get masterKey(): string | null;
}
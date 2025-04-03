export interface IEncryptModel {
    generateKey: () => Promise<string>;
    encrypt: (target:string, key:string) => Promise<string>;
    decrypt: (data:string, key:string) => Promise<string>;
}
export type ProfileMetadata = {
    name: string;
    color: string;
    icon?: any;
}

export interface IProfileSession {
    getData(accessor:string, key: string): Promise<any>;
    setData(accessor:string, key: string, value: any): Promise<void>;

    get id(): string;
}
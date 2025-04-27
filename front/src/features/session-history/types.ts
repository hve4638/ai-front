export type HistoryData = {
    id : number;
    requestType : 'chat'|'normal';
    input : string;
    output : string;
    createdAt : number;
    bookmark : boolean;
    rtId: string;
    rtUUID: string;
    modelId: string;
}
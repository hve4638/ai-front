
declare global {
    type RequestRTData = {
        type : 'result'
        text : string;
        response : unknown;
    } | {
        type : 'stream';
        text : string;
    } | {
        type : 'error';
        text : string;
        data : unknown;
    } | {
        type : 'close';
    }

    type HistoryMetadata = {
        id : number;
        requestType : 'chat'|'normal';
        createdAt : number;
        bookmark : boolean;
    }

    type HistoryMessage = {
        id : number;
        input : string;
        output : string;
    }
}

export {}
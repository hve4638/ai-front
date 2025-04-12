
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
}

export {}
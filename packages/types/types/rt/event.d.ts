import '../prompt-form';

type RTEventDataError = {
    type: 'error'
    detail: string[];
} & (
        {
            reason_id:
            'no_result'
            | 'prompt_build_failed'
            | 'prompt_execute_failed'
            | 'fetch_failed'
            | 'response_failed_with_http_error'
            | 'request_failed'
            | 'invalid_model'
            | 'aborted'
            | 'other';
        } | {
            reason_id: 'http_error'
            http_status: number;
        }
    )
type RTEventDataUpdate = {
    type: 'update'
    update_types: ('input' | 'output' | 'history')[];
}
type RTEventDataOutput = {
    type: 'stream_output';
    text: string;
} | {
    type: 'clear_output';
} | {
    type: 'set_output';
    text: string;
}
type RTEventDataOthers = {
    type: 'close';
}

declare global {
    type RTEventDataWithoutId = (
        RTEventDataError
        | RTEventDataUpdate
        | RTEventDataOutput
        | RTEventDataOthers
    );
    
    type RTEventData = {
        id: string;
    } & RTEventDataWithoutId;
}

export { };
import type { IChatAIAPI } from '../types'
import type { RequestForm, RequestOption, RequestDebugOption } from '../types/request-form'
import { ChatAPIResponse } from '../types/response-data';
import { HTTPError } from '../errors'

abstract class ChatAIAPI implements IChatAIAPI {
    async preprocess() {
        
    }
    async postprocess() {
        
    }
    async request(
        form: RequestForm,
        option:RequestOption,
        debug:RequestDebugOption={}
    ):Promise<ChatAPIResponse> {
        const requestAPI = option.requestAPI;
        const [url, data] = this.makeRequestData(form);
        if (debug.requestData) {
            debug.requestData.url = url;
            debug.requestData.data = data;
        }
        
        const promise = requestAPI(url, data);
        let res:Response;
        try {
            res = await promise;
        }
        catch (e) {
            console.log(e)
            throw new Error('Fetch Fail')
        }
        
        if (res.ok) {
            return this.responseThen(await res.json(), form);
        }
        else {
            let error:Error;
            try {
                error = new HTTPError(res, await res.text());
            }
            catch (e) {
                error = new HTTPError(res);
            }
            throw error;
        }
    }
    abstract makeRequestData(form: RequestForm): [string, RequestInit];
    abstract responseThen(response: any, requestFrom:RequestForm): ChatAPIResponse;
}

export default ChatAIAPI;
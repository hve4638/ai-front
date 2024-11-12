import type { IChatAIAPI } from '../types'
import type { RequestForm, RequestOption } from '../types/request-form'
import { ChatAPIResponse } from '../types/response-data';

abstract class ChatAIAPI implements IChatAIAPI {
    async preprocess() {
        
    }
    async postprocess() {
        
    }
    async request(form: RequestForm, option:RequestOption):Promise<ChatAPIResponse> {
        const requestAPI = option.requestAPI;
        const [url, data] = this.makeRequestData(form);
        
        const res =  await requestAPI(url, data);
        if (res.ok) {
            return this.responseThen(res.data, form);
        }
        else {
            throw new Error(JSON.stringify(res))
        }
    }
    abstract makeRequestData(form: RequestForm): [string, RequestInit];
    abstract responseThen(response: any, requestFrom:RequestForm): ChatAPIResponse;
}

export default ChatAIAPI;
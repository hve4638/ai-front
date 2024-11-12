import type ChatAIAPI from './models/ChatAIAPI';
import type { RequestForm } from './types/request-form';

import {
    ClaudeAPI, OpenAIGPTAPI, GoogleGeminiAPI, GoogleVertexAIAPI,
    MODELS
} from './models';
import type { ChatAPIResponse } from './types/response-data';

import { RequestOption } from './types/request-form';

class AIModelAPI {
    private requestOption:RequestOption;
    private chatAPIs:{[key:string]:ChatAIAPI} = {};

    constructor(requestOption:RequestOption) {
        this.requestOption = requestOption;

        this.refreshCache();
    }

    refreshCache() {
        this.chatAPIs[MODELS.CLAUDE] = new ClaudeAPI();
        this.chatAPIs[MODELS.OPENAI_GPT] = new OpenAIGPTAPI();
        this.chatAPIs[MODELS.GOOGLE_GEMINI] = new GoogleGeminiAPI();
        this.chatAPIs[MODELS.GOOGLE_VERTEXAI] = new GoogleVertexAIAPI();
    }

    async request(form:RequestForm):Promise<ChatAPIResponse> {
        const modelAPI = this.chatAPIs[form.model];

        await modelAPI.preprocess();
        const response = await modelAPI.request(form, this.requestOption);
        await modelAPI.postprocess();

        return response;
    }
}

export default AIModelAPI;
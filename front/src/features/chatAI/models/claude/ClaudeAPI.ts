import type { RequestForm } from '../../types/request-form'
import { ChatAPIResponse } from '../../types/response-data';

import { CLAUDE_URL, ROLE } from './data'

import { assertNotNull, bracketFormat } from '../../utils'

import ChatAIAPI from '../ChatAIAPI'

type ClaudeSystemPrompt = {
    type : 'text';
    text : string;
}[];

type ClaudeMessage = {
    role: string;
    content: string;
}[];

class ClaudeAPI extends ChatAIAPI {
    makeRequestData(form:RequestForm): [string, any] {
        assertNotNull(form.secret?.api_key, 'api_key is required');

        let systemPrompt:ClaudeSystemPrompt = [];
        const messages:ClaudeMessage = [];
        for (const message of form.message) {
            /// @TODO : 이미지 & 파일 처리하도록 추가
            messages.push({
                role: message.role,
                content: message.content[0].text!
            });
        }

        const url = CLAUDE_URL;
        const body = {
            model : form.model_detail,
            messages : messages,
            system : systemPrompt,
            temperature: Number(form.temperature ?? 1.0),
            max_tokens: Number(form.max_tokens),
            top_p : Number(form.top_p),
            top_k: Number(form.top_k),
        }
        const data = {
            method : 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': form.secret.api_key,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify(body)
        }
        
        return [url, data];
    }
    responseThen(rawResponse: any, requestForm:RequestForm): ChatAPIResponse {
        let tokens: number;
        let warning: string | null;
        try {
            tokens = rawResponse.usage.output_tokens;
        }
        catch (e) {
            tokens = 0;
        }
      
        const reason = rawResponse.stop_reason;
        const text = rawResponse.content[0]?.text ?? '';

        if (reason == 'end_turn') warning = null;
        else if (reason == 'max_tokens') warning = 'max token limit';
        else warning = `unhandle reason : ${reason}`;
      
        return {
            output : {
                content : [text]
            },
            tokens : tokens,
            finishReason : reason,

            error : null,
            warning : warning,
            normalResponse : true,
        }
    }
}

export default ClaudeAPI;
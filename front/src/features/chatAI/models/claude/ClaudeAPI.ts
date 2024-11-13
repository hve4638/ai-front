import { ChatRole, type RequestForm } from '../../types/request-form'
import { ChatAPIResponse } from '../../types/response-data';

import { CLAUDE_URL, ROLE, ROLE_DEFAULT } from './data'

import { assertNotNull, bracketFormat } from '../../utils'

import ChatAIAPI from '../ChatAIAPI'

type ClaudeSystemPrompt = {
    type : 'text';
    text : string;
}[];

type ClaudeMessage = {
    role: ROLE;
    content: {
        type: 'text';
        text: string;
    }[];
}[];

class ClaudeAPI extends ChatAIAPI {
    makeRequestData(form:RequestForm): [string, any] {
        assertNotNull(form.secret?.api_key, 'api_key is required');

        let systemPrompt = '';
        const messages:ClaudeMessage = [];
        for (const message of form.message) {
            const role = ROLE[message.role];
            const text = message.content[0].text!;
            
            if (role === ROLE.SYSTEM) {
                if (messages.length === 0) {
                    systemPrompt += text;
                }
                else {
                    messages.push({
                        role: ROLE[ChatRole.BOT],
                        content: [
                            {
                                type: 'text',
                                text: 'system: ' + text,
                            }
                        ]
                    });
                }
            }
            else {
                messages.push({
                    role: role,
                    content: [
                        {
                            type: 'text',
                            text: text,
                        }
                    ]
                });
            }
        }

        const url = CLAUDE_URL;
        const body = {
            model : form.model_detail,
            messages : messages,
            system : systemPrompt,
            max_tokens: form.max_tokens ?? 1024,
            temperature: form.temperature ?? 1.0,
            top_p : form.top_p ?? 1.0,
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
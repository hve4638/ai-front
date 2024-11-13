import { ChatRole, ChatType } from '../../types/request-form'
import type { RequestForm, RequestOption } from '../../types/request-form'
import { ChatAPIResponse } from '../../types/response-data'

import { VERTEXAI_URL, ROLE, ROLE_DEFAULT } from './data'

import { assertNotNull, bracketFormat } from '../../utils'

import ChatAIAPI from '../ChatAIAPI'

import TokenGenerator from './TokenGenerator'
import { ClaudeAPI } from '../claude'

type VertexAIMessage = {
    role: ROLE;
    content: string;
}[];

class GoogleVertexAIAPI extends ChatAIAPI {
    private static claude = new ClaudeAPI();
    private lasttoken:string | null = null;

    override async request(form:RequestForm, option:RequestOption):Promise<ChatAPIResponse> {
        const requestAPI = option.requestAPI;
        let token = this.lasttoken;

        const [url, data] = this.makeRequestData(form);
        const refreshToken = async ()=>{
            await this.#refreshToken({
                clientEmail : form.secret['clientemail'],
                privateKey : form.secret['privatekey']
            });
            this.updateData(data);
            this.updateForm(form);
            token = this.lasttoken;
        }

        try {
            if (token == null) {
                await refreshToken();
            }
            
            const res = await requestAPI(url, data);
            if (res.ok) {
                return res.data;
            }
            else if (res.status === 401) {
                // 토큰 만료시 재시도
                await refreshToken();
                
                const res =  await requestAPI(url, data);
                if (res.ok) {
                    return res.data;
                }
                else {
                    throw new Error(`${res.reason} (${res.status})`);
                }
            }
            else {
                throw new Error(`${res.reason} (${res.status})`);
            }
        }
        finally {
            this.lasttoken = token;
        }
    }

    makeRequestData(form:RequestForm):[string, RequestInit] {
        const projectId = form.secret?.['projectid'];
        const privateKey = form.secret?.['privatekey'];
        const clientEmail = form.secret?.['clientemail'];
        assertNotNull(clientEmail, 'clientemail is required');
        assertNotNull(privateKey, 'privatekey is required');
        assertNotNull(projectId, 'projectid is required');

        const LOCATION = 'us-east5';
        const url = bracketFormat(VERTEXAI_URL, {
            location : LOCATION,
            projectid : projectId,
            model : form.model_detail
        });

        let systemPrompt:string = '';
        const messages:VertexAIMessage = [];

        for (const m of form.message) {
            if (m.role === ChatRole.SYSTEM) {
                if (messages.length === 0) {
                    systemPrompt += m.content[0].text!;
                }
                else {
                    messages.push({
                        role : 'assistant',
                        content : 'system: ' + m.content[0].text!
                    })
                }
            }
            else {
                messages.push({
                    role : ROLE[m.role] ?? ROLE_DEFAULT,
                    content : m.content[0].text!
                })
            }
        }

        const body = {
            anthropic_version: 'vertex-2023-10-16',
            messages : messages,
            system : systemPrompt,
            temperature: form.temperature ?? 1024,
            max_tokens: form.max_tokens ?? 1.0,
            top_p : form.top_p ?? 1.0,
            top_k: 0,
        }
        const data = {
            method : 'POST',
            headers: {
                'Authorization' : `Bearer ${this.lasttoken}`,
                'Content-Type' : 'application/json',
                'charset' : 'utf-8'
            },
            body: JSON.stringify(body),
        }
        
        return [url, data];
    }

    updateData(data:any) {
        data['header']['Authorization'] = `Bearer ${this.lasttoken}`;
    }

    responseThen(rawResponse: any, requestForm:RequestForm): ChatAPIResponse {
        return GoogleVertexAIAPI.claude.responseThen(rawResponse, requestForm);
    }

    async #refreshToken({clientEmail, privateKey}:{clientEmail:string, privateKey:string}) {
        this.lasttoken = await TokenGenerator.generate({
            clientEmail : clientEmail,
            privateKey : privateKey,
            scope : 'https://www.googleapis.com/auth/cloud-platform'
        });
    }

    private async updateForm(form:RequestForm) {
        form.secret['token'] = this.lasttoken;
    }
}

export default GoogleVertexAIAPI;
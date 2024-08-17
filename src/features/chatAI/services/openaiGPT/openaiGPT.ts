import { CurlyBraceFormatParser } from "libs/curlyBraceFormat";

import { AIModel, AIModelRequestData, AIModelReturns } from "data/aimodel/interfaces";
import { AIModelConfig, AIModelRequest, AIModelResponse } from "data/aimodel/interfaces";

import { proxyFetch } from "services/local";

import { OPENAI_GPT_URL, ROLE, ROLE_DEFAULT } from "./constant"

export class OpenAIGPT implements AIModel {
    async preprocess() {

    }
    async postprocess() {
        
    }
    async request(requestdata:AIModelRequestData) {
        const data = requestdata.data;
        const res =  await proxyFetch(requestdata.url, data);
        if (res.ok) {
            return res.data;
        }
        else {
            throw new Error(`${res.reaseon} (${res.status})`)
        }
    }
    async makeRequestData(request: AIModelRequest, config: AIModelConfig, options: any):Promise<AIModelRequestData> {
        const promptParser = new CurlyBraceFormatParser(request.prompt);
        const messages = promptParser.build({
            ...request.curlyBraceFormatArgs,
            role : (x:string) => ROLE[x],
            map : (text, role) => {
                return {
                    role : role,
                    content : text
                }
            }
        });

        const body = {
            model : config.modelname,
            messages : messages,
            temperature: Number(options.temperature),
            max_tokens: Number(options.maxtoken),
            top_p : Number(options.topp),
        }
     
        return {
            url : OPENAI_GPT_URL,
            data : {
                method : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${options.apikey}`
                },
                body: JSON.stringify(body)
            }
        }
    }

    handleResponse(data: any): AIModelResponse {
        return this.#parseResponse(data);
    }

    #parseResponse(rawResponse:any): AIModelResponse {
        let tokens: number;
        let warning: string | null;
        try {
            tokens = rawResponse.usage.completion_tokens;
        }
        catch (e) {
            tokens = 0;
        }
      
        const reason = rawResponse.choices[0]?.finish_reason;
        const text = rawResponse.choices[0]?.message?.content ?? "";

        if (reason === "stop") warning = null;
        else if (reason === "length") warning = "max token limit";
        else warning = `unhandle reason : ${reason}`;
      
        return {
            output : text,
            tokens : tokens,
            finishreason : reason,
            normalresponse : true,
            warning : warning,
            error : "",
            input : "",
            note : {},
            prompt : ""
        }
    }
}
import { AIModel } from "../../data/aimodel/interfaces.tsx";
import { AIModelConfig, AIModelRequest, AIModelResponse } from "../../data/aimodel/interfaces.tsx";

import { CurlyBraceFormatParser } from "../../libs/curlyBraceFormat/index.ts";

import { OPENAI_GPT_URL, ROLE, ROLE_DEFAULT } from "./constant.ts"
import { proxyFetch } from "../local/index.ts";

export class OpenAIGPT implements AIModel {
    request(request:AIModelRequest, config:AIModelConfig, options:any) {
        const promptParser = new CurlyBraceFormatParser(request.prompt);
        const messages = promptParser.build({
            vars : { 
                ...request.note,
            },
            reservedVars : {
                input : request.contents,
            },
            role(x:string) {
                return ROLE[x] ?? ROLE_DEFAULT;
            },
            map(text, role) {
                return {
                    role : role,
                    content : text
                }
            }
        });

        const body = {
            model : config.modelname,
            messages : messages,
            temperature: Number(config.temperature),
            max_tokens: Number(config.maxtoken),
            top_p : Number(config.topp),
        }
        
        console.log('REQUEST');
        console.log(JSON.stringify(body));
        
        const controller = new AbortController();
        const promise = proxyFetch(OPENAI_GPT_URL, {
            method : 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${options.apikey}`
            },
            body: JSON.stringify(body)
        })
        .then(data => {
            console.log('RESPONSE');
            console.log(JSON.stringify(data));

            const apiresponse = {
                ...this.#parseResponse(data),
                input : request.contents,
                note : request.note,
                prompt : request.prompt,
                error : null
            }

            return apiresponse;
        })
        
        return {controller, promise};
    }

    #parseResponse(rawResponse:any) {
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
        }
    }
}
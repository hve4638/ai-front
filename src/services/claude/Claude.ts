import { AIModel } from "../../data/aimodel/interfaces.tsx";
import { AIModelConfig, AIModelRequest, AIModelResponse } from "../../data/aimodel/interfaces.tsx";

import { bracketFormat } from "../../utils/format.tsx";
import { CurlyBraceFormatParser } from "../../libs/curlyBraceFormat/index.ts";

import { CLAUDE_URL, ROLE, ROLE_DEFAULT } from "./constant.ts"
import { proxyFetch } from "../local/index.ts";

export class Claude implements AIModel {
    request(request:AIModelRequest, config:AIModelConfig, options:any) {
        const promptParser = new CurlyBraceFormatParser(request.prompt);
        let systemPrompt = "";
        const messages:{role:string,content:string}[] = []
        /*
            Claude는 system 프롬프트가 별개의 필드로 들어감
        */
        promptParser.build({
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
                if (role === "system") {
                    systemPrompt += text;
                }
                else {
                    messages.push({
                        role : role,
                        content : text
                    })
                }
            }
        });

        const body = {
            model : config.modelname,
            messages : messages,
            system : systemPrompt,
            temperature: Number(config.temperature),
            max_tokens: Number(config.maxtoken),
            top_p : Number(config.topp),
            top_k: 0,
        }
        
        console.log('REQUEST');
        console.log(JSON.stringify(body));
        
        const controller = new AbortController();
        const promise = proxyFetch(CLAUDE_URL, {
            method : 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': options.apikey,
                'anthropic-version': '2023-06-01'
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
            tokens = rawResponse.usage.output_tokens;
        }
        catch (e) {
            tokens = 0;
        }
      
        const reason = rawResponse.stop_reason;
        const text = rawResponse.content[0]?.text ?? "";

        if (reason == "end_turn") warning = null;
        else if (reason == "max_tokens") warning = "max token limit";
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
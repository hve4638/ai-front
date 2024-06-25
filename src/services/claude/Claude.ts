import { AIModel } from "../../data/aimodel/interfaces.tsx";
import { AIModelConfig, AIModelRequest, AIModelResponse } from "../../data/aimodel/interfaces.tsx";

import { bracketFormat } from "../../utils/format.tsx";
import { CurlyBraceFormatParser } from "../../libs/curlyBraceFormat/index.ts";

import { CLAUDE_URL, ROLE, ROLE_DEFAULT } from "./constant.ts"

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
                contents : request.contents
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
        const promise = fetch(CLAUDE_URL, {
            signal : controller.signal,
            method : 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': options.apikey
            },
            body: JSON.stringify(body)
        })
        .then(async res => {
            const data = await res.json();
            if (!res.ok) {
                throw data.error.message;
            }
            else {
                console.log('RESPONSE');
                console.log(JSON.stringify(data));
                throw new Error("Stop")
                const apiresponse = {
                    ...this.#parseResponse(data),
                    input : request.contents,
                    note : request.note,
                    prompt : request.prompt,
                    error : null
                }

                return apiresponse;
            }
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
        // @TODO: reason에 따른 warning 추가 필요
        warning = null;
      
        return {
          output : text,
          tokens : tokens,
          finishreason : reason,
          normalresponse : true,
          warning : warning,
        }
    }
}
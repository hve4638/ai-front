import { AIModel, AIModelRequestData, AIModelReturns } from "../../data/aimodel/interfaces.tsx";
import { AIModelConfig, AIModelRequest, AIModelResponse } from "../../data/aimodel/interfaces.tsx";

import { bracketFormat } from "../../utils/format.tsx";
import { CurlyBraceFormatParser } from "../../libs/curlyBraceFormat/index.ts";

import { CLAUDE_URL, ROLE } from "./constant.ts"
import { proxyFetch } from "../local/index.ts";

export class Claude implements AIModel {
    async preprocess() {

    }
    async postprocess() {
        
    }
    async request(requestdata:AIModelRequestData) {
        const res =  await proxyFetch(requestdata.url, requestdata.data);
        if (res.ok) {
            return res.data;
        }
        else {
            throw new Error(`${res.reaseon} (${res.status})`)
        }
    }
    async makeRequestData(request: AIModelRequest, config: AIModelConfig, options: any):Promise<AIModelRequestData> {
        let systemPrompt = "";
        const messages:{role:string,content:string}[] = []
        
        const promptParser = new CurlyBraceFormatParser(request.prompt);
        promptParser.build({
            vars : { 
                ...request.note,
            },
            reservedVars : {
                input : request.contents,
            },
            role(x:string) {
                return ROLE[x];
            },
            map(text, role) {
                if (role === "system") {
                    if (messages.length === 0) {
                        systemPrompt += text;
                    }
                    else {
                        messages.push({
                            role : "assistant",
                            content : 'system: ' + text
                        })
                    }
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
            temperature: Number(options.temperature),
            max_tokens: Number(options.maxtoken),
            top_p : Number(options.topp),
            top_k: 0,
        }
        
        return {
            url : CLAUDE_URL,
            data :  {
                method : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': options.apikey,
                    'anthropic-version': '2023-06-01'
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
            error : null,
            input : "",
            note : {},
            prompt : ""
        }
    }
}
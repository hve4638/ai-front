import { APIResponse } from "../../data/interface.tsx";
import { bracketFormat } from "../../utils/format.tsx";
import { CurlyBraceFormatParser } from "../../libs/curlyBraceFormat/index.ts";

import {GENIMIAPI_URL_FORMAT, GENIMI_OPTION_SAFETY, GENIMI_ROLE, GENIMI_ROLE_DEFAULT } from './constant.ts'
import { AIModelConfig, AIModelRequest, AIModelResponse } from "../../data/aimodel/interfaces.tsx";
import { AIModel } from "../../data/aimodel/interfaces.tsx";
import { proxyFetch } from "../local/index.ts";

interface Note {
    [key:string]:string
}

interface requestArgs {
    contents:string;
    prompt:string;
    note:Note;
    modelname:string;

    apikey:string;
    maxtoken:string;
    temperature:string;
    topp:string;

    safety?:boolean;
    mock?:boolean;
}
  
export interface Response {
    input: string|null,
    output : string|null,
    prompt : string|null,
    note : Note|null,
    tokens : number,
    reason : string,
    warning : string|null
}

interface RequestReturns {
    promise:Promise<APIResponse>
    controller:AbortController
}

export class GoogleGemini implements AIModel {
    request(request:AIModelRequest, config:AIModelConfig, options:any) {
        const url = bracketFormat(GENIMIAPI_URL_FORMAT, {
            apikey : options.apikey,
            modelname : config.modelname
        });
        const promptParser = new CurlyBraceFormatParser(request.prompt);
        const result = promptParser.build({
            vars : { 
                ...request.note,
            },
            reservedVars : {
                input : request.contents,
            },
            role(x:string) {
                return GENIMI_ROLE[x] ?? GENIMI_ROLE_DEFAULT;
            },
            map(text, role) {
                return {
                    role : role,
                    parts : [
                        {
                            text: text
                        }
                    ]
                }
            }
        });
        
        const body = {
            contents: result,
            "generation_config" : {
                "maxOutputTokens": config.maxtoken,
                "temperature": config.temperature,
                "topP": config.topp
            },
            "safetySettings" : GENIMI_OPTION_SAFETY
        };
        console.log('REQUEST');
        console.log(JSON.stringify(body));
        
        const controller = new AbortController();
        // signal : controller.signal,
        const promise = proxyFetch(url, {
            method : 'POST',
            headers: {
                'Content-Type': 'application/json'
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
            tokens = rawResponse.usageMetadata.candidatesTokenCount;
        }
        catch (e) {
            tokens = 0;
        }
      
        const reason = rawResponse.candidates[0]?.finishReason;
        const text = rawResponse.candidates[0]?.content?.parts[0].text ?? '';
        
        if (reason == "STOP") warning = null;
        else if (reason == 'SAFETY') warning = 'blocked by SAFETY';
        else if (reason == "MAX_TOKENS") warning = 'max token limit';
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
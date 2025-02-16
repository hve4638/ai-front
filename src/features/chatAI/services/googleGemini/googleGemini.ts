import { AIModelConfig, AIModelRequest, AIModelRequestData, AIModelResponse, AIModelReturns } from 'data/aimodel/interfaces';
import { AIModel } from 'data/aimodel/interfaces';
import { APIResponse } from 'data/interface';
import { CurlyBraceFormatBuildArgs, CurlyBraceFormatParser } from 'libs/curlyBraceFormat';
import { bracketFormat } from 'utils/format';

import { proxyFetch } from 'services/local';

import {GENIMIAPI_URL_FORMAT, GENIMI_OPTION_SAFETY, GENIMI_OPTION_SAFETY_OFF, GENIMI_ROLE, GENIMI_ROLE_DEFAULT } from './constant'

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

    async makeRequestData(request:AIModelRequest, config:AIModelConfig, options:any):Promise<AIModelRequestData> {
        const url = bracketFormat(GENIMIAPI_URL_FORMAT, {
            apikey : options.apikey,
            modelname : config.modelname
        });
        const promptParser = new CurlyBraceFormatParser(request.prompt);
        const result = promptParser.build({
            ...request.curlyBraceFormatArgs,
            role : (x:string) => GENIMI_ROLE[x],
            map : (text, role) => {
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

        let safety;
        if (config.modelname === 'gemini-2.0-flash-exp') {
            safety = GENIMI_OPTION_SAFETY_OFF;
        }
        else {
            safety = GENIMI_OPTION_SAFETY;
        }
        
        const body = {
            contents: result,
            "generation_config" : {
                "maxOutputTokens": options.maxtoken,
                "temperature": options.temperature,
                "topP": options.topp
            },
            "safetySettings" : safety
        };

        return {
            comment : "google gemini request",
            url : url,
            data : {
                method : 'POST',
                headers: {
                    'Content-Type': 'application/json'
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
            error : null,
            input : "",
            note : {},
            prompt : ""
        }
    }
}
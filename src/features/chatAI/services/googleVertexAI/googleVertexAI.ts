import { CurlyBraceFormatParser } from 'libs/curlyBraceFormat'
import { AIModel } from 'data/aimodel/interfaces'
import { AIModelConfig, AIModelRequest, AIModelRequestData, AIModelResponse } from 'data/aimodel/interfaces'

import { bracketFormat } from 'utils/format'

import { proxyFetch } from 'services/local'

import { SecretContextType } from 'context/SecretContext'

import { Claude } from '../claude'
import { TokenGenerator } from './tokenGenerator'
import { VERTEXAI_URL, ROLE, ROLE_DEFAULT } from './constant'

export class GoogleVertexAI implements AIModel {
    static #claude = new Claude();
    #lasttoken:string;
    #secretContext:SecretContextType;
    #category:string;
    #options;

    constructor({ secretContext, category }:{ secretContext:SecretContextType, category:string }) {
        this.#secretContext = secretContext;
        this.#category = category;
        this.#lasttoken = "";
    }

    async preprocess() {
        const { modelInfo } = this.#secretContext;
        this.#lasttoken = modelInfo.modelOptions[this.#category].token;
    }
    async postprocess() {
        const { setModelInfo, modelInfo } = this.#secretContext;
        const newModelInfo = {...modelInfo};
        newModelInfo.modelOptions[this.#category].token = this.#lasttoken;


        setModelInfo(newModelInfo);
    }

    async makeRequestData(request: AIModelRequest, config: AIModelConfig, options: any):Promise<AIModelRequestData> {
        if (!options.clientemail) {
            throw new Error("clientemail is invalid.");
        }
        if (!options.privatekey) {
            throw new Error("privatekey is invalid.");
        }
        if (!options.projectid) {
            throw new Error("projectid is invalid.");
        }
        this.#options = options;

        const LOCATION = "us-east5";
        const url = bracketFormat(VERTEXAI_URL, {
            location : LOCATION,
            projectid : options.projectid,
            model : config.modelname
        });

        let systemPrompt = "";
        const messages:{role:string,content:string}[] = []
        
        const promptParser = new CurlyBraceFormatParser(request.prompt);
        promptParser.build({
            ...request.curlyBraceFormatArgs,
            role : (x:string) => ROLE[x],
            map : (text, role) => {
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
            anthropic_version: "vertex-2023-10-16",
            messages : messages,
            system : systemPrompt,
            temperature: Number(options.temperature),
            max_tokens: Number(options.maxtoken),
            top_p : Number(options.topp),
            top_k: 0,
        }
        
        return {
            url : url,
            data : {
                method : "POST",
                headers: {
                    "Authorization" : `Bearer TOKEN`,
                    "Content-Type" : "application/json",
                    "charset" : "utf-8"
                },
                body: JSON.stringify(body),
            }
        }
    }

    async request(requestdata:AIModelRequestData) {
        const data = requestdata.data;
        const res =  await proxyFetch(requestdata.url, data);
        if (res.ok) {
            return res.data;
        }
        else if (res.status === 401) { // 토큰 만료시 재시도
            await this.#refreshToken();
            const newRequestdata = await this.#updateTokenInRequestData(requestdata);
            const res =  await proxyFetch(newRequestdata.url, data);
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

    handleResponse(data: any): AIModelResponse {
        return GoogleVertexAI.#claude.handleResponse(data);
    }

    async #refreshToken() {
        const options = this.#options;
        if (!options) {
            throw new Error("options are empty.");
        }

        this.#lasttoken = await TokenGenerator.generate({
            clientEmail : options.clientemail,
            privateKey : options.privatekey,
            scope : "https://www.googleapis.com/auth/cloud-platform"
        });
    }

    async #updateTokenInRequestData(requestdata:AIModelRequestData) {
        const newRequestdata = {...requestdata}
        newRequestdata.data.headers["Authorization"] = `Bearer ${this.#lasttoken}`;
        return newRequestdata;
    }
}
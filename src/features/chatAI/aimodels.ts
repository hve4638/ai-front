import { SecretContextType, ModelInfo } from "../../context/SecretContext.tsx"
import { AIModel, AIModelConfig, AIModelRequest, AIModelResponse, AIModelReturns } from "../../data/aimodel/interfaces.ts"
import { TARGET_ENV } from "../../data/constants.tsx"
import { Claude } from "../../services/claude/Claude.ts"
import { GoogleGemini } from "../../services/googleGemini/index.ts"
import { GoogleVertexAI } from "../../services/googleVertexAI/googleVertexAI.ts"
import { proxyFetch } from "../../services/local/index.ts"
import { OpenAIGPT } from "../../services/openaiGPT/openaiGPT.ts"

export const MODELS = {
    GOOGLE_GEMINI : "GOOGLE_GEMINI",
    OPENAI_GPT : "OPENAI_GPT",
    CLAUDE : "CLAUDE",
    GOOGLE_VERTEXAI : "GOOGLE_VERTEXAI"
}

const modelCategory = {
    [MODELS.GOOGLE_GEMINI] : {
        name : "Google Gemini",
        models : [
            { name : "Gemini 1.5 Pro ", value: "gemini-1.5-pro-latest" },
            { name : "Gemini 1.5 Flash", value: "gemini-1.5-flash" },
            { name : "Gemini 1.0 Pro", value: "gemini-1.0-pro" },
        ]
    },
    [MODELS.OPENAI_GPT] : {
        name: "OpenAI GPT",
        models : [
            { name : "GPT 4o", value: "gpt-4o" },
            { name : "GPT 4", value: "gpt-4-turbo" },
            { name : "GPT 3.5 Turbo", value: "gpt-3.5-turbo" },
        ]
    },
    [MODELS.GOOGLE_VERTEXAI] : {
        name : "Google VertexAI",
        models : [
            { name : "Claude Sonnet 3.5", value: "claude-3-5-sonnet@20240620" }
        ]
    }
}

if (TARGET_ENV === "WINDOWS") {
    // CORS 정책으로 WEB에서 사용할 수 없는 모델 목록

    modelCategory[MODELS.CLAUDE] = {
        "name" : "Anthropic Claude",
        "models" : [
            { name : "Sonnet 3.5", value: "claude-3-5-sonnet-20240620" }
        ]
    };
}

export class AIModels {
    static #models = modelCategory;
    
    static getCategories() {
        const categories:{name:string, value:string}[] = []
        for (const key in this.#models) {
            categories.push({name : this.#models[key].name, value:key})
        }
        return categories;
    }

    static getModels(category:string):{name:string, value:string}[] {
        const models = this.#models[category]?.models ?? [];
        return models;
    }

    static async request(request:AIModelRequest, {secretContext, storeContext}):Promise<AIModelResponse> {
        const category = secretContext.modelInfo.category;
        const model = secretContext.modelInfo.model;
        const options = secretContext.modelInfo.modelOptions[category] ?? {};
        
        let aimodel:AIModel|null;
        if (category == MODELS.GOOGLE_GEMINI) {
            aimodel = new GoogleGemini();
        }
        else if (category == MODELS.OPENAI_GPT) {
            aimodel = new OpenAIGPT();
        }
        else if (category == MODELS.CLAUDE) {
            aimodel = new Claude();
        }
        else if (category == MODELS.GOOGLE_VERTEXAI) {
            aimodel = new GoogleVertexAI({ secretContext, category });
        }
        else {
            throw new Error("Not implement");
        }

        const config:AIModelConfig = {
            topp : secretContext.topp,
            temperature : secretContext.temperature,
            maxtoken : secretContext.maxtoken,
            modelname : model
        }
        
        await aimodel.preprocess();
        const requestdata = await aimodel.makeRequestData(request, config, options);
        
        console.log("AIModel RequestData");
        console.log(requestdata);

        const response = await aimodel.request(requestdata);
        //await proxyFetch(requestdata.url, requestdata.data);

        console.log("AIModel ResponseData");
        console.log(response);

        await aimodel.postprocess();
        
        return {
            ...aimodel.handleResponse(response),
            input : request.contents,
            note : request.note,
            prompt : request.prompt,
            error : null
        }
    }
}
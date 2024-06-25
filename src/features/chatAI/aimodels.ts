import { APIContextType, ModelInfo } from "../../context/APIContext.tsx"
import { AIModel, AIModelRequest, AIModelReturns } from "../../data/aimodel/interfaces.ts"
import { Claude } from "../../services/claude/Claude.ts"
import { GoogleGemini } from "../../services/googleGemini/index.ts"
import { OpenAIGPT } from "../../services/openaiGPT/openaiGPT.ts"

export const MODELS = {
    GOOGLE_GEMINI : "GOOGLE_GEMINI",
    OPENAI_GPT : "OPENAI_GPT",
    CLAUDE : "CLAUDE"
}

export class AIModels {
    static #models = {
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
        // Claude 모델 비활성화
        // CORS 에러에 의해 사용할 수 없음
        /*
        [MODELS.CLAUDE] : {
            "name" : "Claude",
            "models" : [
                { name : "Sonnet 3.5", value: "sonnet-3.5" }
            ]
        }
        */
    }
    
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

    static request(apiContext:APIContextType, request:AIModelRequest):AIModelReturns {
        const category = apiContext.modelInfo.category;
        const model = apiContext.modelInfo.model;
        const options = apiContext.modelInfo.modelOptions[category] ?? {};
        
        const config = {
            topp : apiContext.topp,
            temperature : apiContext.temperature,
            maxtoken : apiContext.maxtoken,
            modelname : model
        }

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
        else {
            throw new Error("Not Implement")
        }
        
        return aimodel.request(request, config, options);
    }
}
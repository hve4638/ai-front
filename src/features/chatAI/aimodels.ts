import { AIModel, AIModelConfig, AIModelRequest, AIModelResponse, AIModelReturns } from "data/aimodel/interfaces"
import { DEBUG_MODE, DEFAULT_MAXTOKEN, DEFAULT_TEMPERATURE, DEFAULT_TOPP, TARGET_ENV } from "data/constants"
import { MODELS, MODEL_CATEGORY } from './models'

import { MockAIModel } from "./services/mockAIModel"
import { Claude } from "./services/claude/Claude"
import { GoogleGemini } from "./services/googleGemini"
import { GoogleVertexAI } from "./services/googleVertexAI/googleVertexAI"
import { OpenAIGPT } from "./services/openaiGPT/openaiGPT"
import { DEFAULT_BUILTIN_VARS, DEFAULT_EXPRESSION_EVENT_HOOKS } from "./defaultBuildArgs"
import { CurlyBraceFormatBuildArgs, CurlyBraceFormatParser } from "libs/curlyBraceFormat"

export class AIModels {
    static #models = MODEL_CATEGORY;
    
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

    static interpretePrompt(request:Omit<AIModelRequest, 'curlyBraceFormatArgs'>) {
        let buildArgs = {
            expressionEventHooks : DEFAULT_EXPRESSION_EVENT_HOOKS,
            vars : {
                ...request.note,
            },
            builtInVars : {
                ...DEFAULT_BUILTIN_VARS,
                input : request.contents,
            },
            currentScope : {},
        } as CurlyBraceFormatBuildArgs;

        const promptParser = new CurlyBraceFormatParser(request.prompt);
        return promptParser.build({
            ...buildArgs,
            role : (x:string) => x,
            map : (text, role) => {
                return {
                    role : role,
                    content : text
                }
            }
        });
    }

    static async request(request:Omit<AIModelRequest, 'curlyBraceFormatArgs'>, {secretContext}):Promise<AIModelResponse> {
        const category = request.modelCategory;
        const model = request.modelName;
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
        else if (category == MODELS.DEBUG_MODE) {
            aimodel = new MockAIModel();
        }
        else {
            throw new Error('Invalid Model Category');
        }

        options.topp ??= DEFAULT_TOPP;
        options.temperature ??= DEFAULT_TEMPERATURE;
        options.maxtoken ??= DEFAULT_MAXTOKEN;

        const config:AIModelConfig = {
            topp : secretContext.topp,
            temperature : secretContext.temperature,
            maxtoken : secretContext.maxtoken,
            modelname : model
        }

        let newRequest:AIModelRequest = {
            ...request,
            curlyBraceFormatArgs : {
                vars : {
                    ...request.note,
                },
                builtInVars : {
                    ...DEFAULT_BUILTIN_VARS,
                    input : request.contents,
                },
                expressionEventHooks : DEFAULT_EXPRESSION_EVENT_HOOKS,
                currentScope : {},
            }
        };
        
        await aimodel.preprocess();
        const requestdata = await aimodel.makeRequestData(newRequest, config, options);
        
        console.log("AIModel RequestData");
        console.log(requestdata);

        const response = await aimodel.request(requestdata);

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
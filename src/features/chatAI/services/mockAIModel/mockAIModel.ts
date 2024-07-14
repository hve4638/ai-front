import { AIModel, AIModelRequestData, AIModelReturns } from "../../interface.ts";
import { AIModelConfig, AIModelRequest, AIModelResponse } from "../../interface.ts";

export class MockAIModel implements AIModel {
    async preprocess() {

    }
    async postprocess() {
        
    }

    async makeRequestData(request: AIModelRequest, config: AIModelConfig, options: any) {
        return {
            url : ":debugmode",
            data : {
                body: request.contents
            }
        }
    }

    request(requestdata:AIModelRequestData) {
        const data = requestdata.data;
        
        return new Promise((resolve, reject)=>{
            setTimeout(()=>{
                resolve(data.body);
            }, 1000)
        });
    }

    handleResponse(data: any): AIModelResponse {
        return {
            input : "",
            output : data,
            prompt : "",
            note : {},
            tokens : 0,
            finishreason : "end",
            warning : null,
            normalresponse : true,
            error : null,
        }
    }
}
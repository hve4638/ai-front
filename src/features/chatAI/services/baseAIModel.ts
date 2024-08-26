import { proxyFetch } from "services/local";
import { AIModelConfig, AIModelRequest, AIModelRequestData, AIModelResponse } from "../interface";
import { NotImplementedError } from "features/errors";

export class BaseAIModel {
    constructor() {

    }

    preprocess() {

    }
    postprocess() {
        
    }
    async request(requestdata:AIModelRequestData):Promise<any> {
        const data = requestdata.data;
        const res:{
            ok:boolean,
            status:number,
            reason:string,
            data:any,
            type:string,
        } = await proxyFetch(requestdata.url, data);
        if (res.ok) {
            return res.data;
        }
        else {
            throw new Error(`${res.reason} (${res.status})`)
        }
    }
    async makeRequestData(request:AIModelRequest, config:AIModelConfig, options:any):Promise<AIModelRequestData> {
        throw new NotImplementedError('Need to override');
    }
    handleResponse(data:any):AIModelResponse {
        throw new NotImplementedError('Need to override');
    }
}
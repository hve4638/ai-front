import { Note } from "../interface";

export interface AIModelRequest {
    contents : string;
    prompt : string;
    note : Note;
}
  
export interface AIModelConfig {
    topp:string;
    temperature:string;
    maxtoken:string;
    modelname:string;
}

export interface AIModelResponse {
    input: string;     // 사용자 요청 텍스트
    output : string;   // AI 응답 텍스트
    prompt : string;   // Prompt 템플릿
    note : Note;       // key,value 노트
    tokens : number;        // 응답 토큰 수
    finishreason : string;  // 응답 종료 원인
    warning : string|null;  // 경고 (토큰 한도, safety 등)
    normalresponse : boolean; // 정답 응답 여부
    error : string|null;    // 정상 응답이 아닐시 에러텍스트
}

export interface AIModel {
    makeRequestData(request:AIModelRequest, config:AIModelConfig, options:any):AIModelRequestData;
    handleResponse(data:any):AIModelResponse;
    //request(requestdata:AIModelRequestData):AIModelReturns;
    //request(requestdata:AIModelRequestDataargs:AIModelRequest, config:AIModelConfig, options:any):AIModelReturns;
}

export interface AIModelRequestData { 
    comment?: string;
    url: string;
    data: any;
}


export interface AIModelReturns {
    controller:AbortController;
    promise:Promise<AIModelResponse>;
}
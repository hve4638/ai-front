export interface ChatAPIResponse {
    input? : {
        promptText : string;   // Prompt 템플릿
        note : {[key:string]:string}; // Prompt 템플릿에 사용되는 노트
        content : string[];
    };
    output : {
        content : string[];   // AI 응답 텍스트
    };
    tokens : number;        // 응답 토큰 수
    finishReason : string;  // 응답 종료 원인

    error : string|null;    // 정상 응답이 아닐시 에러텍스트
    warning : string|null;  // 경고 (토큰 한도, safety 등)
    normalResponse : boolean; // 정답 응답 여부
}

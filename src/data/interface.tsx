export interface Note {
    [key: string]: string;
}

export interface APIResponse {
  input: string|null;     // 사용자 요청 텍스트
  output : string|null;   // AI 응답 텍스트
  prompt : string|null;   // Prompt 템플릿
  note : Note|null;       // key,value 노트
  tokens : number;        // 응답 토큰 수
  finishreason : string;  // 응답 종료 원인
  warning : string|null;  // 경고 (토큰 한도, safety 등)
  normalresponse : boolean; // 정답 응답 여부
  error : string|null;    // 정상 응답이 아닐시 에러텍스트
}

export interface MainPrompt {
  name: string,
  value: string,
  path: string|undefined,
  key: string,
  list: SubPrompts[]|undefined,
  vars: string[]|undefined,
}
export interface SubPrompt {
  name: string,
  value: string,
  key: string,
  vars: string[]|undefined,
}


export interface MainPrompts {
  name: string,
  value: string,
  path: string|undefined,
  key: string,
  list: SubPrompts[]|undefined,
  vars: string[]|undefined,
}

export interface SubPrompts {
  name: string,
  value: string,
  key: string,
  vars: string[]|undefined,
}

export type Vars = Map<string, VarItem[]>

export interface VarItem {
  name:string,
  value:string
}

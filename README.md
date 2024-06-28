# AI Front

![front](/img/01.png)

React.js 기반 챗봇 프론트엔드

별도의 백엔드 없이 단독으로 동작합니다.

## 호스팅 방법

[release](https://github.com/hve4638/ai-front/releases)에서 정적 웹 어플리케이션 파일을 받고 정적 웹호스팅 도구를 이용해 사용할 수 있습니다.


1. [python](https://www.python.org) 설치
2. [release](https://github.com/hve4638/ai-front/releases)에서 최신 빌드를 다운로드
3. 압축을 풀고 해당 폴더에서 터미널을 열기
4. 터미널에 `python -m http.server` 입력해 웹서버 열기
5. 포트 번호를 확인하고 (일반적으로 8000) `http://localhost:포트`로 접속해 사용할 수 있습니다.


## 프롬프트 리스트 구조

웹페이지가 열리면 `public/prompts/list.json` 에서 목록을 가져옵니다.

`list.json` 의 구조는 다음을 따릅니다.
1. 최상위 객체에는 두 개의 키 `prompts`, `vars`가 존재합니다.
2. `prompts`는 배열이며 배열에 들어가는 객체의 구조는 다음과 같습니다.
    - name : 문자열, 프론트엔드에 표시되는 이름
    - value : 문자열, 프롬프트의 파일명을 의미하며 `public/prompts/` 경로에서 찾습니다. 하위 프롬프트가 존재한다면 생략합니다.
    - key : 문자열, 고유 식별자
    - list : 배열, 하위 프롬프트 목록을 생성합니다. 하위 프롬프트가 존재하지 않는다면 생략합니다.
        - 배열에 들어가는 요소는 하위 프롬프트의 정보를 나타내는 객체입니다.
        - 하위 프롬프트의 구조는 상위 프롬프트의 구조와 유사하나 list가 없으며 value를 비워둘 수 없습니다. 즉, 하위 프롬프트가 또 다른 하위 프롬프트를 가질 수 없습니다.
    - vars : 배열, 사용할 var 이름을 배열의 요소로 추가합니다. 생략할 수 있습니다. 들어가는 요소는 `vars`에서 추가하고 사용 할 수 있습니다.
3. `vars`는 객체이며 var 목록을 나타냅니다.
    - (var 이름, var 배열)의 형태로 키-값 쌍이 들어갑니다.
    - var 배열에는 `{ name, value }` 구조를 가진 객체가 요소로 들어갑니다.
        - name : 문자열, 프론트엔드에서 표시되는 이름
        - value : 문자열, 실제로 프롬프트에 들어가는 값

### 예시

```json
{
    "prompts" : [
        {
            "name" : "없음",
            "key" : "noprompt",
            "value" : "noprompt"
        },
        {
            "name" : "번역",
            "key" : "translate",
            "list" : [
                {
                    "name" : "범용",
                    "value" : "translate-normal",
                    "key" : "translate-normal",
                    "vars" : [ "lang" ]
                },
                {
                    "name" : "소설",
                    "value" : "translate-novel",
                    "key" : "translate-novel",
                    "vars" : [ "lang" ]
                }
            ]
        }
    ],
    "vars" : {
        "lang" : [
            { "name" : "한국어", "value" : "korean" },
            { "name" : "영어", "value" : "english" }
        ]
    }
}
```

## 프롬프트 템플릿

두개의 중괄호로(`{{}}`) 로 감싸진 문자열은 특별한 값으로 인식하여 전처리합니다.

*작성중*

### 역할 (role) 변경

- `{{::role 역할}}`

들어갈 수 있는 값: system, model, user

### 조건문

- `{{::if 표현식}}`
- `{{::elif 표현식}}`
- `{{::elseif 표현식}}`
- `{{::else}}`
- `{{::endif}}`

최종 프롬프트에 조건이 참인 블럭 내의 프롬프트는 포함되며 그렇지 않으면 제거됩니다.

C언어의 `#IF` 전처리문과 유사하게 작동합니다.

### 변수

- `{{변수}}`

최종 프롬프트에서 지정한 `vars`의 값으로 교체됩니다.

### 예약어

- `{{:예약어}}`

최종 프롬프트에서 특정한 값으로 교체됩니다.

*예약어 목록*
- `{{:input}}` : 사용자의 입력

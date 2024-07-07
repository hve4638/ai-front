# AI Front

![front](/img/01.png)

React.js 기반 챗봇 프론트엔드 예제

별도의 백엔드 없이 단독으로 동작합니다.

## 설치 및 사용

- [Relase](https://github.com/hve4638/ai-front/releases)
- [위키](https://github.com/hve4638/ai-front/wiki/How-to-use) 참조

## 사용 방법

![setting](/img/02.png)

우측 상단의 아이콘을 클릭해 설정 창에서 확인할 수 있습니다.

**필요한 설정**
- `모델` : 사용할 모델을 지정합니다.
    - 현재 사용가능한 모델 : *Gemini* 및 *GPT* 계열 모델 일부
- `API` : 각 공급사에서 제공하는 API키
- `응답 토큰 제한` : 최대 응답 가능한 토큰의 수. 모델별로 토큰 단위가 상이합니다.
    - 일반적으로 영어는 단어 당, 한글은 글자 당 토큰 하나이며 모델에 따라 더 효율적이거나 비효율적으로 토큰을 처리합니다.
- `온도`와 `top-p` : AI 응답의 랜덤성에 관련된 설정입니다.
    - 일반적으로 0~1.0 사이 값을 가지며 창의력을 요구하거나 범용적인 작업은 1.0, 번역과 같이 정확도를 요구하는 작업은 더 낮은 값을 사용합니다.

## prompts/list.json 및 프롬프트 구조 가이드

- [prompts/list.json](https://github.com/hve4638/ai-front/wiki/Prompt-list)
- [프롬프트 템플릿](https://github.com/hve4638/ai-front/wiki/Prompt-template)
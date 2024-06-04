# AI Front

![front](/img/01.png)

Genimi Pro 1.5 API를 호출하는 프론트엔드의 예제입니다j

## 프롬프트 추가

`public/prompts/list.json` 파일을 열고 다음 포맷에 맞게 추가하거나 수정합니다.
1. 루트는 배열입니다.
2. 각 객체는 키가 `{ name, value }` 또는 `{ name, sub }` 인 형태로 넣을 수 있습니다.
    - `name`은 노출되는 이름이 저장됩니다.
    - `value`는 `public/prompts/` 안에 위치하는 프롬프트가 저장된 파일명입니다.
    - `value` 대신 `sub`를 넣을 수 있으며 하위 카테고리를 추가합니다.
        - `sub` 는 배열이 들가며 배열 내에 `{ name, value }` 키를 객체가 들어갑니다.

## 프롬프트의 예약어

프롬프트 내에서 다음 키워드는 api 요청시 다음과 같이 교체됩니다.

- `{{lang}}` : 선택한 언어 단어로 교체됩니다. *(ex. korean, english)*
- `{{contents}}` : 입력값을 교체됩니다.

## TODO

- Gemini 계열 모델 선택 지원
- OAI 등 타 LLM API 지원
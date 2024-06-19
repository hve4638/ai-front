import { APIResponse } from "../data/interface.tsx";
import { bracketFormat } from "../utils/format.tsx";

interface Note {
  [key: string]: string;
}

interface requestAIGenimiProps {
  contents:string,
  prompt:string,
  note:Note,
  apikey:string,
  maxtoken:string,
  temperature:string,
  topp:string,
  safety?:boolean,
  mock?:boolean
}

export interface Response {
  input: string|null,
  output : string|null,
  prompt : string|null,
  note : Note|null,
  tokens : number,
  reason : string,
  warning : string|null
}

const GENIMIAPI_URL_FORMAT = 'https://generativelanguage.googleapis.com/v1beta/models/{{modelname}}:generateContent?key={{apikey}}';
const GENIMI_OPTION_SAFETY = [
  {
    "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    "threshold": "BLOCK_NONE"
  },
  {
    "category": "HARM_CATEGORY_HATE_SPEECH",
    "threshold": "BLOCK_NONE"
  },
  {
    "category": "HARM_CATEGORY_HARASSMENT",
    "threshold": "BLOCK_NONE"
  },
  {
    "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
    "threshold": "BLOCK_NONE"
  }
] as const;

export function requestAIGenimi(props:requestAIGenimiProps):{promise:Promise<APIResponse>,controller:AbortController} {
    const {
      contents, apikey, prompt, note, maxtoken, temperature, topp, safety=false, mock=false
    } = props;
    // const text = contents;

    const text = bracketFormat(prompt, { ...note, contents })
    
    const url = bracketFormat(GENIMIAPI_URL_FORMAT, {
      apikey : apikey,
      modelname : 'gemini-1.5-pro-latest'
    })
    console.log('text')
    console.log(text)

    const body = {
      contents: [{
        parts: [{
          text: text
        }]
      }],
      "generation_config": {
        "maxOutputTokens": maxtoken,
        "temperature": temperature,
        "topP": topp
      }
    };

    if (!safety) {
      body['safetySettings'] = GENIMI_OPTION_SAFETY;
    }

    console.log(`request to ${url}`)
    
    const controller = new AbortController();
    const promise = fetch(url, {
      signal : controller.signal,
      method : 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    .then(async res => {
      const data = await res.json();
      if (!res.ok) {
        throw data.error.message;
      }
      else {
        const apiresponse = makeResponse(data);
        apiresponse.input = contents;
        apiresponse.note = note;
        apiresponse.prompt = prompt
        return apiresponse;
      }
    })
    
    return {controller, promise};
}

const makeResponse = (response:any):APIResponse => {
  let tokens: number;
  let warning: string | null;
  try {
      tokens = response.usageMetadata.candidatesTokenCount;
  }
  catch (e) {
      tokens = 0;
  }

  console.log(response)
  console.log(response.candidates)
  const reason = response.candidates[0]?.finishReason;
  const text = response.candidates[0]?.content?.parts[0].text ?? '';
  if (reason == 'SAFETY') warning = 'blocked by SAFETY';
  else if (reason == "MAX_TOKENS") warning = 'token limit';
  else warning = null;

  return {
    input: null,
    output : text,
    prompt : null,
    note : null,
    tokens : tokens,
    finishreason : reason,
    normalresponse : true,
    warning : warning,
    error : null
  }
}
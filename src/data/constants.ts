export const HOMEPAGE = process.env.REACT_APP_HOMEPAGE ?? '';
export const GITHUB_LINK='https://github.com/hve4638/ai-front'
export const DOWNLOAD_LINK='https://github.com/hve4638/ai-front/releases'

// 1년간 쿠키 유효
export const COOKIE_OPTION_NOEXPIRE = {
    expires: new Date(Date.now() + 31536000000)
}

export const ENCRYPT_KEY = 'bbbeb10b1c00b979207e63f94602d94c46b2483d25253291b018342d1404318b';
export const DEBUG_MODE = process.env.REACT_APP_DEBUG === 'TRUE';
export const EVENT_LOGGING_MODE = process.env.REACT_APP_EVENT_LOGGING === 'TRUE';

export const TARGET_ENV = process.env.REACT_APP_TARGET_ENV ?? 'WEB';
export const VERSION = process.env.REACT_APP_VERSION ?? 'v0.0.0';

export const MODEL_CATEGORY = {
    GOOGLE_GEMINI:'GOOGLE_GEMINI',
    OPENAI_GPT:'OPENAI_GPT'
} as const;

export const NOSESSION_KEY = '#GLOBAL';

export const SESSION_TEMPLATE = {
    id : -1,
    historyIsolation : false,
    chatIsolation : false,
    color : null,
    modelCategory : '',
    modelName : '',
    note : {},
    promptKey : undefined,
    historyKey : '',
} as const;

export const DEFAULT_TOPP = 1.0;
export const DEFAULT_TEMPERATURE = 1.0;
export const DEFAULT_MAXTOKEN = 1000;

export const APIRESPONSE_TEMPLATE = {
    input: '',
    output : '',
    prompt: '',
    note : {},
    tokens: 0,
    warning: null,
    error : null,
    finishreason : '',
    normalresponse : true
} as const;
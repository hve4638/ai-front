export const HOMEPAGE = process.env.REACT_APP_HOMEPAGE ?? '';
export const GITHUB_LINK='https://github.com/hve4638/ai-front'

// 1년간 쿠키 유효
export const COOKIE_OPTION_NOEXPIRE = {
    expires: new Date(Date.now() + 31536000000)
}

export const ENCRYPT_KEY = 'bbbeb10b1c00b979207e63f94602d94c46b2483d25253291b018342d1404318b';
export const DEBUG_MODE = false;

export const MODEL_CATEGORY = {
    GOOGLE_GEMINI:"GOOGLE_GEMINI",
    OPENAI_GPT:"OPENAI_GPT"
} as const;
export const HOMEPAGE = '/deploy/ai-front';
export const GITHUB_LINK='https://github.com/hve4638/ai-front'

export const SEND_STATE = {
    READY : 'READY',
    LOADING : 'LOADING'
}
export const RESPONSE_STATE = {
    RESPONSE : 'RESPONSE',
    ERROR : 'ERROR'
}

export const COOKIE_OPTION_NOEXPIRE = {
    expires: new Date(Date.now() + 31536000000)
}

export const RunningModeEnum = {
    CLINET_ONLY : 'CLINET_ONLY',
    WITH_SERVER : 'WITH_SERVER',
}

export const RUNNING_MODE = RunningModeEnum.CLINET_ONLY;
export const ENCRYPT_KEY = 'bbbeb10b1c00b979207e63f94602d94c46b2483d25253291b018342d1404318b';

export const DEBUG_MODE = true;
import general from './general';
import masterKey from './masterKey';
import globalStorage from './globalStorage';
import profile from './profile'
import profileRT from './profileRT'
import profileSession from './profileSession'
import profileSessionHistory from './profileSessionHistory';
import type { IPCHandlers } from './types';

function get():IPCHandlers {
    return {
        ...general(),
        ...masterKey(),
        ...globalStorage(),
        ...profile(),
        ...profileRT(),
        ...profileSession(),
        ...profileSessionHistory(),
    };
}

export { type IPCHandlers };
export default get;
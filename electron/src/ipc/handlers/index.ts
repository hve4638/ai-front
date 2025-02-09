import general from './general';
import masterKey from './masterKey';
import globalStorage from './globalStorage';
import profile from './profile'
import profileRT from './profileRT'
import profileSession from './profileSession'
import profileSessionHistory from './profileSessionHistory';

function get():IPCInterface {
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

export default get;
import general from './general';
import masterKey from './masterKey';
import globalStorage from './globalStorage';
import profiles from './profiles';
import profile from './profile';
import profileSessions from './profileSessions';
import profileSession from './profileSession';
import profileSessionHistory from './profileSessionHistory';
import profileStorage from './profileStorage';
import profileSessionStorage from './profileSessionStorage';
import profileRTs from './profileRTs';
import profileRT from './profileRT';
import profileRTStorage from './profileRTStorage';
import profileRTPrompt from './profileRTPrompt';
import request from './request';

function get():IPCInvokerInterface {
    return {
        general : general(),
        globalStorage : globalStorage(),
        masterKey : masterKey(),
        
        profiles : profiles(),
        profile : profile(),
        profileStorage : profileStorage(),
        profileSession : profileSession(),
        profileSessions : profileSessions(),
        profileSessionStorage : profileSessionStorage(),
        profileSessionHistory : profileSessionHistory(),

        profileRTs : profileRTs(),
        profileRT : profileRT(),
        profileRTStorage : profileRTStorage(),
        profileRTPrompt : profileRTPrompt(),
        
        request : request(),
    };
}

export default get;
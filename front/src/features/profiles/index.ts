export type { 
    IProfile, 
    IProfiles, 
    IProfileSession 
} from './types';

import ProfilesConstructor from './Profiles'
const Profiles = new ProfilesConstructor();

export default Profiles;
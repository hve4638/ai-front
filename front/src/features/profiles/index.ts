export type { 
    IProfileSession 
} from './types';
export { type default as Profile } from './Profile'

import ProfilesConstructor from './Profiles'
const Profiles = new ProfilesConstructor();

export default Profiles;
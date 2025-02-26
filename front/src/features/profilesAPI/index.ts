export type { 
    IProfileSession 
} from './types';
export { type default as Profile } from './ProfileAPI'

import ProfilesConstructor from './ProfilesAPI'
const Profiles = new ProfilesConstructor();

export default Profiles;
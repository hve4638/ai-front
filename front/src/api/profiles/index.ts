import ProfilesAPI from './ProfilesAPI';
export type { default as ProfileAPI } from './ProfileAPI';
export type { default as SessionAPI } from './SessionAPI';
export type { default as RTAPI } from './RTAPI';

const ProfilsAPISingleton = new ProfilesAPI();

export default ProfilsAPISingleton;
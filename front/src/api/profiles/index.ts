import ProfilesAPI from './ProfilesAPI';
export type { default as ProfileAPI } from './ProfileAPI';

const ProfilsAPISingleton = new ProfilesAPI();

export default ProfilsAPISingleton;
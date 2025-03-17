import { ProfileEventContext, useContextForce } from 'context';

function useProfile() {
    return useContextForce(ProfileEventContext);
}

export default useProfile;
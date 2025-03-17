import { ProfileSessionContext, useContextForce } from 'context';

function useProfileSession() {
    return useContextForce(ProfileSessionContext);
}

export default useProfileSession;
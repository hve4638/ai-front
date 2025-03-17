import { ProfileStorageContext, useContextForce } from 'context';

function useProfileStorage() {
    return useContextForce(ProfileStorageContext);
}

export default useProfileStorage;
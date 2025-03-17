import { useContextForce } from 'context';
import { ProfileRTContext } from 'context/ProfileRTContext';

function useRT() {
    return useContextForce(ProfileRTContext);
}

export default useRT;
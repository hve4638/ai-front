import {RawProfileContextProvider} from './RawProfileContext';
import {ProfileContextProvider} from './ProfileContext';
// import MemoryContextProvider from './MemoryContext';
//import SessionContextProvider from './SessionContext';

export function Providers({children, profileId}: {children:React.ReactNode, profileId:string}) {
    return (
        <RawProfileContextProvider profileId={profileId}>
            <ProfileContextProvider>
                {children}
            </ProfileContextProvider>
        </RawProfileContextProvider>
    );
}
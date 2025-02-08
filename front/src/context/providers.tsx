import {RawProfileContextProvider} from './RawProfileContext';
import {ProfileContextProvider} from './ProfileContext';
import { RawProfileSessionContextProvider } from './RawProfileSessionContext';
// import MemoryContextProvider from './MemoryContext';
//import SessionContextProvider from './SessionContext';

export function Providers({children, profileId}: {children:React.ReactNode, profileId:string}) {
    return (
        <RawProfileContextProvider profileId={profileId}>
            <ProfileContextProvider>
                <RawProfileSessionContextProvider>
                    {children}
                </RawProfileSessionContextProvider>
            </ProfileContextProvider>
        </RawProfileContextProvider>
    );
}
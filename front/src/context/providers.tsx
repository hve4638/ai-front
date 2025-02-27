import {ProfileStorageContextProvider} from './ProfileStorageContext';
import {ProfileEventContextProvider} from './ProfileEventContext';
import { RawProfileSessionContextProvider } from './RawProfileSessionContext';
// import MemoryContextProvider from './MemoryContext';
//import SessionContextProvider from './SessionContext';

export function Providers({children, profileId}: {children:React.ReactNode, profileId:string}) {
    return (
        <ProfileStorageContextProvider profileId={profileId}>
            <ProfileEventContextProvider>
                <RawProfileSessionContextProvider>
                    {children}
                </RawProfileSessionContextProvider>
            </ProfileEventContextProvider>
        </ProfileStorageContextProvider>
    );
}
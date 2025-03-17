import { ProfileStorageContextProvider } from './ProfileStorageContext';
import { ProfileEventContextProvider } from './ProfileEventContext';
import { ProfileSessionContextProvider } from './ProfileSessionContext';

export function Providers({children, profileId}: {children:React.ReactNode, profileId:string}) {
    return (
        <ProfileStorageContextProvider
            id={profileId}
        >
            <ProfileEventContextProvider>
                <ProfileSessionContextProvider>
                    {children}
                </ProfileSessionContextProvider>
            </ProfileEventContextProvider>
        </ProfileStorageContextProvider>
    );
}
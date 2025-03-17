// import { useEffect, useState } from 'react';
// import { ProfileStorageContextProvider } from 'context/ProfileStorageContext';
// import { ProfileEventContextProvider } from 'context/ProfileEventContext';
// import { ProfileSessionContextProvider } from 'context/ProfileSessionContext';
// import ProfilesAPI, { type ProfileAPI } from 'api/profiles';

// function Providers({children, profileId}: {children:React.ReactNode, profileId:string}) {
//     const [profileAPI, setProfileAPI] = useState<ProfileAPI|null>(null);

//     useEffect(()=>{
//         ProfilesAPI.getProfile(profileId)
//             .then((api)=>{
//                 setProfileAPI(api);
//             });
//     }, [profileId])

//     return (
//         profileAPI !== null &&
//         <ProfileStorageContextProvider
//             profileId={profileId}
//             api={profileAPI}
//         >
//             <ProfileEventContextProvider>
//                 <ProfileSessionContextProvider>
//                     {children}
//                 </ProfileSessionContextProvider>
//             </ProfileEventContextProvider>
//         </ProfileStorageContextProvider>
//     );
// }

// export default Providers;
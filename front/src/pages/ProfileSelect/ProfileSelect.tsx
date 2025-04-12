import { useEffect, useState } from 'react';
import ProfilesAPI from 'api/profiles';
import { ProfileAddButton, ProfileButton, ProfileOptionButton } from 'components/ProfileSelect';
import NewProfileModal from './NewProfileModal';

import RedIcon from 'assets/img/red.png'
import useSignal from 'hooks/useSignal';
import { ProfileMetadata } from './types';

interface ProfileSelectPageProps {
    onSelect: (profileName: string) => void;
}

function ProfileSelectPage({
    onSelect,
}: ProfileSelectPageProps) {
    const [reloadProfiles, triggerReloadProfiles] = useSignal();
    const [showModal, setShowModal] = useState(false);
    const [profiles, setProfiles] = useState<ProfileMetadata[]>([]);
    const [profileIds, setProfileIds] = useState<string[]>([]);

    useEffect(() => {
        ProfilesAPI.getProfileIds()
            .then(async (nextProfileIds) => {
                console.log('Loaded profiles:', nextProfileIds);
                
                const newProfiles:ProfileMetadata[] = [];
                for (const id of nextProfileIds) {
                    const profileAPI = await ProfilesAPI.getProfile(id);
                    const { name, color } = await profileAPI.get('config.json', ['name', 'color']);
                    newProfiles.push({
                        id : id,
                        name : name,
                        color : color,
                    });
                }
                setProfileIds(nextProfileIds);
                setProfiles(newProfiles);
            });
    }, [reloadProfiles]);

    return (
        <div
            className='column center wfill undraggable'
            style={{
                padding: '8px',
            }}
        >
            {
                showModal &&
                <NewProfileModal
                    onSubmit={async (metadata) => {
                        const id = await ProfilesAPI.createProfile();
                        const profile = await ProfilesAPI.getProfile(id);
                        await profile.set('config.json', {
                            name: metadata.name,
                            color: metadata.color,
                        });
                        
                        triggerReloadProfiles();
                    }}
                    onClose={()=>{
                        setShowModal(false);
                    }}
                />
            }
            <h2
                className='center'
                style={{
                    marginBottom: '16px'
                }}
            >프로필 선택</h2>
            {
                profiles.map((metadata, index) => {
                    return (
                        <ProfileButton
                            key={index}
                            identifier={metadata.id}
                            name={metadata.name}
                            image={RedIcon}
                            onClick={async () => {
                                onSelect(metadata.id);
                            }}
                        />
                    );
                })
            }
            <ProfileAddButton onClick={() => setShowModal(true)}/>
            <ProfileOptionButton/>
        </div>
    );
}

export default ProfileSelectPage;
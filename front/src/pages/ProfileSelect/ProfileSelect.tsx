import { useEffect, useState } from 'react';
import { ProfileAddButton, ProfileButton, ProfileOptionButton } from 'components/ProfileSelect';
import NewProfileModal from './NewProfileModal';

import RedIcon from 'assets/img/red.png'
import useSignal from 'hooks/useSignal';
import { ProfileMetadata } from './types';
import Profiles from 'features/profilesAPI';
import { GoogleFontIcon } from 'components/GoogleFontIcon';

import styles from './styles.module.scss';
import classNames from 'classnames';

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
        Profiles.getProfileIds()
            .then(async (nextProfileIds) => {
                console.log('Loaded profiles:', nextProfileIds);
                
                const newProfiles:ProfileMetadata[] = [];
                for (const id of nextProfileIds) {
                    const profile = await Profiles.getProfile(id);
                    newProfiles.push({
                        id : id,
                        name : profile.name,
                        color : profile.color,
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
                        const id = await Profiles.createProfile();
                        const profile = await Profiles.getProfile(id);
                        profile.name = metadata.name;
                        profile.color = metadata.color;
                        
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
                                const profile = await Profiles.getProfile(metadata.id);
                                // console.log(profile.name);
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
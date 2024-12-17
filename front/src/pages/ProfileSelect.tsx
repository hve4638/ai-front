import { ProfileButton, ProfileAddButton, ProfileOptionButton } from 'components/ProfileSelect'
import RedIcon from 'assets/img/red.png'

interface ProfileSelectPageProps {
    profiles: string[];
    onSelect: (profileName: string) => void;
}

function ProfileSelectPage({
    profiles,
    onSelect
}: ProfileSelectPageProps) {
    return (
        <div
            className='column center wfill undraggable'
            style={{
                padding: '8px'
            }}
        >
            <h2
                className='center'
                style={{
                    marginBottom: '16px'
                }}
            >프로필 선택</h2>
            {
                profiles.map((profileName, index) => {
                    return (
                        <button
                            key={index}
                            onClick={() => {
                                console.log('hi')
                            }}
                        >
                            {profileName}
                        </button>
                    );
                })
            }
            <ProfileButton
                name='Guest'
                identifier='guest'
                image={RedIcon}
                onClick={(profileName, identifier) => {
                    onSelect(profileName);
                }}
            />
            <ProfileAddButton/>
            <ProfileOptionButton/>
        </div>
    );
}

export default ProfileSelectPage;
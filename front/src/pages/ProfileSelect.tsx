import { Profiles } from 'features/profiles'

function ProfileSelectPage() {
    const profileNames = Profiles.names;
    console.log(profileNames);
    
    return (
        <div
            className='column'
        >
            <h2>프로필 선택</h2>
            {
                profileNames.map((profileName, index) => {
                    return (
                        <button
                            key={index}
                            onClick={() => {
                            }}
                        >
                            {profileName}
                        </button>
                    );
                })
            }
        </div>
    );
}

export default ProfileSelectPage;
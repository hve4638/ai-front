import { useEffect, useState } from 'react'
import LocalAPI from 'api/local';
import Providers from 'context';
import useSignal from 'hooks/useSignal';
import LoadPage from 'features/loading';
import Profiles from 'features/profiles';
import ProfileSelectPage from 'pages/ProfileSelect';
import Home from 'pages/Home';
import MasterKeyInitailize from 'pages/MasterKeyInitailize';
import Hub from 'pages/Hub';

const LoadPhase = {
    BEGIN : 0,
    INIT_MASTER_KEY : 1,
    LOADING_PROFILE_METADATA : 2,
    SELECT_PROFILE : 3,
    ENTRYPOINT : 10,
}
type LoadPhase = typeof LoadPhase[keyof typeof LoadPhase];

function App() {
    const [currentState, setCurrentState] = useState<LoadPhase>(LoadPhase.BEGIN);
    const [retrySignal, sendRetrySignal] = useSignal();
    const [profile, setProfile] = useState<string|null>(null);

    useEffect(() => {
        (async ()=> {
            console.log('currentState', currentState);
            switch (currentState) {
                case LoadPhase.BEGIN:
                    setCurrentState(LoadPhase.INIT_MASTER_KEY);
                    break;
                case LoadPhase.INIT_MASTER_KEY:
                    break;
                case LoadPhase.LOADING_PROFILE_METADATA:
                    const lastProfile = await Profiles.getLastProfile();

                    if (lastProfile == null) {
                        setProfile(null);
                        setCurrentState(LoadPhase.SELECT_PROFILE);
                    }
                    else {
                        setProfile(lastProfile);
                        setCurrentState(LoadPhase.ENTRYPOINT);
                    }
                    break;
                case LoadPhase.SELECT_PROFILE:
                    if (profile != null) {
                        setCurrentState(LoadPhase.ENTRYPOINT);
                    }
                    break;
                case LoadPhase.ENTRYPOINT:
                    break;
            }
        })();
    }, [currentState, retrySignal]);
    
    useEffect(() => {
        const handleBeforeUnload = (event) => {
            LocalAPI.echo('[MESSAGE] UNHANDLE');
        };
        
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    return (
        <div
            className={
                'theme-dark fill'
                // + (layoutMode == LayoutModes.AUTO ? ' layout-auto' : '')
                // + (layoutMode == LayoutModes.HORIZONTAL ? ' layout-horizontal' : '')
                // + (layoutMode == LayoutModes.VERTICAL ? ' layout-vertical' : '')
            }
            style={{
                fontSize: '18px'
            }}
        >
            {
                (
                    currentState == LoadPhase.BEGIN ||
                    currentState == LoadPhase.LOADING_PROFILE_METADATA
                ) &&
                <LoadPage/>
            }
            {
                currentState == LoadPhase.INIT_MASTER_KEY &&
                <MasterKeyInitailize
                    onFinished={() => {
                        setCurrentState(LoadPhase.LOADING_PROFILE_METADATA);
                    }}
                />
            }
            {
                currentState == LoadPhase.SELECT_PROFILE &&
                <ProfileSelectPage
                    onSelect={async (id) => {
                        await Profiles.setLastProfile(id);
                        setCurrentState(LoadPhase.LOADING_PROFILE_METADATA);
                    }}
                />
            }
            {
                currentState == LoadPhase.ENTRYPOINT &&
                <Providers profileId={profile!}>
                    <Hub/>
                </Providers>
            }            
        </div>
    )
}

export default App

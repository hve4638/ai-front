import { useEffect, useState } from 'react'
import Providers from 'context'
import Profiles from 'features/profiles'
import ProfileSelectPage from 'pages/ProfileSelect';
import Home from 'pages/Home';
import LoadPage from 'features/loading';
import usePing from 'hooks/useSignal';
import LocalAPI from 'api/local';

const LoadPhase = {
    INIT : 0,
    LOADING_PROFILE_METADATA : 1,
    SELECT_PROFILE : 2,
    ENTRYPOINT : 10,
}
type LoadPhase = typeof LoadPhase[keyof typeof LoadPhase];

function App() {
    const [currentState, setCurrentState] = useState<LoadPhase>(LoadPhase.INIT);
    const [retryInitialization, pingRetryInitialization] = usePing();
    const [profile, setProfile] = useState<string|null>(null);

    useEffect(() => {
        const call = async ()=> {
            switch (currentState) {
                case LoadPhase.INIT:
                    setCurrentState(LoadPhase.LOADING_PROFILE_METADATA);
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
        }
        call();
    }, [currentState, retryInitialization]);
    
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
                    currentState == LoadPhase.INIT ||
                    currentState == LoadPhase.LOADING_PROFILE_METADATA
                ) &&
                <LoadPage/>
            }
            {
                currentState == LoadPhase.SELECT_PROFILE &&
                <ProfileSelectPage
                    onSelect={async (id) => {
                        await Profiles.setLastProfile(id);
                        setCurrentState(LoadPhase.LOADING_PROFILE_METADATA);
                        pingRetryInitialization();
                    }}
                />
            }
            {
                currentState == LoadPhase.ENTRYPOINT &&
                <Providers profileId={profile!}>
                    <Home/>
                </Providers>
            }
        </div>
    )
}

export default App

import { useEffect, useState } from 'react'
import { useContextForce, RawProfileContext } from 'context'
import { LayoutModes } from 'types/profile'
import Profiles from 'features/profiles'
import ProfileSelectPage from 'pages/ProfileSelect';
import Home from 'pages/Home';
import LoadPage from 'features/loading';
import usePing from 'hooks/usePing';

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
    const [profileName, setProfileName] = useState<string|null>(null);
    const [profileNames, setProfileNames] = useState<string[]>([]);

    useEffect(() => {
        switch (currentState) {
            case LoadPhase.INIT:
                setCurrentState(LoadPhase.LOADING_PROFILE_METADATA);
                break;

            case LoadPhase.LOADING_PROFILE_METADATA:
                if (Profiles.loaded) {
                    setProfileNames(Profiles.profileNames ?? []);

                    if (Profiles.lastProfileName == null) {
                        setProfileName(null);
                        setCurrentState(LoadPhase.SELECT_PROFILE);
                    }
                    else {
                        setProfileName(Profiles.lastProfileName);
                        setCurrentState(LoadPhase.ENTRYPOINT);
                    }
                }
                else {
                    setTimeout(() => {
                        pingRetryInitialization();
                    }, 100);
                }
                break;
            case LoadPhase.SELECT_PROFILE:
                if (profileName != null) {
                    setCurrentState(LoadPhase.ENTRYPOINT);
                }
                break;
            case LoadPhase.ENTRYPOINT:
                break;
        }
    }, [currentState, retryInitialization]);

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
                    profiles={profileNames}
                    onSelect={(profileName) => {
                        setProfileName(profileName);
                        pingRetryInitialization();
                    }}
                />
            }
            {
                currentState == LoadPhase.ENTRYPOINT &&
                <>
                    <Home/>
                </>
            }
        </div>
    )
}

export default App

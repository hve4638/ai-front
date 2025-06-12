import { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import classNames from 'classnames';

import ProfilesAPI from '@/api/profiles';
import { useProfileAPIStore } from '@/stores';
import { ModalProvider } from '@/hooks/useModal';

import ProfileSelectPage from '@/pages/ProfileSelect';
import Hub from '@/pages/Hub';

import useMemoryStore from './stores/useMemoryStore';
import {
    Bootstrap,
    useBootStore,
    useInitialize
} from './features/bootstrap';

const LoadPhase = {
    Boot: 'boot',
    ProfileSelect: 'ProfileSelect',
    Login: 'login',
    Main: 'main',
};
type LoadPhase = typeof LoadPhase[keyof typeof LoadPhase];

function App() {
    const booted = useBootStore(state => state.booted);
    const memoryStore = useMemoryStore();
    const [profileInitialized, setProfileInitialized] = useState(false);

    const phase = useMemo<LoadPhase>(() => {
        if (!booted) {
            return LoadPhase.Boot;
        }
        else if (memoryStore.profileId == null) {
            return LoadPhase.ProfileSelect;
        }
        else if (!profileInitialized) {
            return LoadPhase.Login;
        }
        else {
            return LoadPhase.Main;
        }
    }, [booted, memoryStore.profileId, profileInitialized]);

    useInitialize();
    useLayoutEffect(() => {
        if (phase === LoadPhase.ProfileSelect) {
            setProfileInitialized(false);
            ProfilesAPI.setLast(null);
        }
        else if (phase === LoadPhase.Login) {
            if (memoryStore.profileId == null) {
                console.warn('logic error: profileId is null in Login phase');
                return;
            }
            ProfilesAPI.setLast(memoryStore.profileId);

            useProfileAPIStore.getState().setAPI(memoryStore.profileId);
            const { api } = useProfileAPIStore.getState();

            // @TODO
            // 앞으로 더 많은 작업이 추가되면
            // LoadGlobalDataPhase 처럼 작업 분리 필요
            const promises = [
                api.getChatAIModels()
                    .then((models) => {
                        useMemoryStore.setState({ allModels: models })
                    }),
            ];
            Promise.all(promises)
                .then(() => {
                    setProfileInitialized(true);
                })
        }
    }, [phase, memoryStore.profileId]);

    return (
        <div
            className={
                classNames(
                    'theme-dark',
                    'fill',
                )
            }
            style={{
                fontSize: '18px'
            }}
        >
            {
                phase === LoadPhase.Boot &&
                <ModalProvider>
                    <Bootstrap />
                </ModalProvider>
            }
            {
                phase === LoadPhase.ProfileSelect &&
                <ModalProvider>
                    <ProfileSelectPage />
                </ModalProvider>
            }
            {
                phase === LoadPhase.Main &&
                <Hub />
            }
        </div>
    )
}

export default App;
import { useEffect, useState } from 'react'
import LocalAPI from 'api/local';
import useSignal from 'hooks/useSignal';
import LoadPage from 'features/loading';
import ProfileSelectPage from 'pages/ProfileSelect';
import MasterKeyInitailize from 'pages/MasterKeyInitailize';
import Hub from 'pages/Hub';
import { ModalProvider } from 'hooks/useModal';
import { useProfileAPIStore, useCacheStore } from '@/stores';

const LoadPhase = {
    BEGIN : 0,
    INIT_MASTER_KEY : 1,
    LOADING_PROFILE_METADATA : 2,
    SELECT_PROFILE : 3,
    ENTRYPOINT : 10,
};
type LoadPhase = typeof LoadPhase[keyof typeof LoadPhase];

function App() {
    const [currentState, setCurrentState] = useState<LoadPhase>(LoadPhase.BEGIN);
    const [retrySignal, sendRetrySignal] = useSignal();
    const [profile, setProfile] = useState<string|null>(null);
    const profileAPIStore = useProfileAPIStore();
    const last_session_id = useCacheStore(state=>state.last_session_id)
    const updateCache = useCacheStore(state=>state.update)

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
                    if (last_session_id == null) {
                        setProfile(null);
                        setCurrentState(LoadPhase.SELECT_PROFILE);
                    }
                    else {
                        setProfile(last_session_id);
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
    }, [currentState, retrySignal, profileAPIStore.api]);
    
    useEffect(() => {
        const handleBeforeUnload = (event) => {
            LocalAPI.echo('[MESSAGE] UNHANDLE');
        };
        
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    useEffect(() => {
        // RequestAPI.register();
        
        // return () => {
        //     RequestAPI.unregister();
        // };
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
                <ModalProvider>
                    <MasterKeyInitailize
                        onFinished={() => {
                            setCurrentState(prev=>{
                                if (prev === LoadPhase.INIT_MASTER_KEY) {
                                    return LoadPhase.LOADING_PROFILE_METADATA;
                                }
                                else {
                                    return prev;
                                }
                            });
                        }}
                    />
                </ModalProvider>
            }
            {
                currentState == LoadPhase.SELECT_PROFILE &&
                <ProfileSelectPage
                    onSelect={async (id:string) => {
                        await profileAPIStore.setAPI(id);
                        await updateCache.last_session_id(id);

                        setCurrentState(prev=>{
                            if (prev === LoadPhase.SELECT_PROFILE) {
                                return LoadPhase.LOADING_PROFILE_METADATA;
                            }
                            else {
                                return prev;
                            }
                        });
                    }}
                />
            }
            {
                currentState == LoadPhase.ENTRYPOINT &&
                <Hub/>
            }            
        </div>
    )
}

export default App;
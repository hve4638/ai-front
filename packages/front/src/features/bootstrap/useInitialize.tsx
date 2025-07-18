import { useEffect, useState } from 'react'
import LocalAPI from '@/api/local';
import RequestAPI from '@/api/request';

import { subscribeStates, useSignalStore } from '@/stores';
import useMemoryStore from '@/stores/useMemoryStore';

function useInitialize() {
    useEffect(() => {
        // Zustand State 의존성 관련 구독
        return subscribeStates();
    }, []);

    useEffect(() => {
        RequestAPI.register()

        return () => {
            RequestAPI.unregister();
        }
    }, []);

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            LocalAPI.general.echo('[MESSAGE] UNHANDLE');
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);
    
    useEffect(() => {
        return useSignalStore.subscribe(
            (state) => state.change_profile,
            (state) => {
                useMemoryStore.setState({ profileId: null });
            }
        )
    }, []);
}

export default useInitialize;
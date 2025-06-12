import { useEffect, useState } from 'react';

import useSignal from '@/hooks/useSignal';
import ProfilesAPI from '@/api/profiles';
import { useGlobalConfigStore, useProfileAPIStore } from '@/stores';

import useBootStore from '../useBootStore';
import useMemoryStore from '@/stores/useMemoryStore';
import LocalAPI from '@/api/local';

function LoadGlobalDataPhase() {
    const apiState = useProfileAPIStore();
    const { update } = useBootStore();

    useEffect(() => {
        const promises = [
            ProfilesAPI.getLast()
                .then((lastProfileId)=>{
                    if (lastProfileId != null) {
                        useMemoryStore.setState({ profileId: lastProfileId });
                        apiState.setAPI(lastProfileId);
                    }
                })
                .catch((err) => {
                    console.error('Failed to load last profile:', err);
                }),
            LocalAPI.general.getAvailableVersion()
                .then((availableVersion) => {
                    useMemoryStore.setState({ availableVersion })
                })
                .catch(err => {
                    // nothing to do
                }),
            LocalAPI.general.getCurrentVersion()
                .then((version) => {
                    useMemoryStore.setState({ version })
                }),
            useGlobalConfigStore.getState().refetchAll(),
        ];

        Promise.all(promises)
            .then(()=>{
                update.nextPhase();
            });
    }, []);

    return <></>
}

export default LoadGlobalDataPhase;
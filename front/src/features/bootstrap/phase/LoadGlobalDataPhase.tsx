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
            LocalAPI.general.getChatAIModels()
                .then((allModels) => {
                    const modelsMap: Record<string, ChatAIModel> = {};
                    for (const provider of allModels) {
                        for (const category of provider.list) {
                            for (const model of category.list) {
                                modelsMap[model.id] = model;
                            }
                        }
                    }

                    useMemoryStore.setState({ allModels, modelsMap });
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
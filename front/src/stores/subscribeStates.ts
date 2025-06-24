import useCacheStore from './useCacheStore';
import useConfigStore from './useConfigStore';
import useDataStore from './useDataStore';
import { useHistoryStore } from './useHistoryStore';
import useProfileAPIStore from './useProfileAPIStore';
import useSessionStore from './useSessionStore';
import useShortcutStore from './useShortcutStore';

export function subscribeStates() {
    const unsubscribes = [
        useProfileAPIStore.subscribe(
            ({ api }) => {
                if (api.isMock()) return;
                
                useCacheStore.getState().refetchAll();
                useDataStore.getState().refetchAll();
                useConfigStore.getState().refetchAll();
                useShortcutStore.getState().refetchAll();
                useHistoryStore.getState().clear();
                
                const sessionState = useSessionStore.getState();
                sessionState.updateDeps.api(api);
                sessionState.refetchAll();
            }
        ),
        useCacheStore.subscribe(
            ({ last_session_id })=>[ last_session_id ],
            async () => {
                const { api } = useProfileAPIStore.getState();
                if (api.isMock()) return;
                
                const { last_session_id } = useCacheStore.getState();
                
                const sessionState = useSessionStore.getState();
                await sessionState.refetchAll();
                sessionState.updateDeps.last_session_id(last_session_id);
            }
        )
    ];

    return () => {
        unsubscribes.forEach(unsub => unsub());
    };
}

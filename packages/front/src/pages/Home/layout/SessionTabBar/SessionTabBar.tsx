import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useCacheStore, useDataStore, useSignalStore } from '@/stores';
import { ProfileSessionMetadata } from '@/types';
import TabBar from '@/components/TabBar';
import { TabRequired } from '@/components/TabBar/types';
import SessionTab from './SessionTab';
import { useTranslation } from 'react-i18next';
import ProfileEvent from '@/features/profile-event';

function SessionTabBar() {
    const { t } = useTranslation();
    const updateCacheState = useCacheStore(state => state.update);
    const sessions = useDataStore(state => state.sessions);
    const refreshSignal = useSignalStore(state => state.session_metadata);
    const last_session_id = useCacheStore(state => state.last_session_id);

    const [sessionMetadataList, setSessionMetadataList] = useState<ProfileSessionMetadata[]>([]);
    const tabItems = useMemo(() => sessionMetadataList.map((metadata) => ({ ...metadata, key: metadata.id })), [sessionMetadataList]);
    const focusTab = useMemo(() => {
        const empty = {
            key: 'empty',
            id: 'empty',
            name: 'empty',
        };
        if (!last_session_id) return empty;

        const target = sessionMetadataList.find((item) => item.id === last_session_id);
        if (!target) return empty;

        return { ...target, key: target.id, };
    }, [sessionMetadataList, last_session_id]);

    const onFocus = (item: ProfileSessionMetadata, index) => updateCacheState.last_session_id(item.id);
    const onAdd = () => ProfileEvent.session.create();
    const onRemove = (item: ProfileSessionMetadata, index) => ProfileEvent.session.remove(item.id);
    const onChangeTabOrder = (list: ProfileSessionMetadata[]) => ProfileEvent.session.reorder(list.map(item => item.id));
    const onUndoRemove = () => ProfileEvent.session.undo();

    useEffect(() => {
        ProfileEvent.session.getMetadataList()
            .then((list) => {
                list.forEach((item) => {
                    item.displayName ??= t('session.default_name');
                });
                setSessionMetadataList(list);
            });
    }, [sessions, refreshSignal]);

    return (
        <TabBar<ProfileSessionMetadata & TabRequired, TabRequired>
            items={tabItems}
            focus={focusTab}
            onFocus={onFocus}
            onAdd={onAdd}
            onRemove={onRemove}
            onChangeTabOrder={onChangeTabOrder}
            onUndoRemove={onUndoRemove}
            tabRender={({
                item,
                widthPx,
                selected,
                onClick,
                onClose,
            }) => (
                <SessionTab
                    item={item}
                    widthPx={widthPx}
                    selected={selected}
                    onClick={onClick}
                    onClose={onClose}
                />
            )}
        />
    );
}

export default SessionTabBar;
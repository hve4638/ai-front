import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCacheStore, useProfileAPIStore, useProfileEvent, useSessionStore } from '@/stores';
import { Modal, ModalHeader } from '@/components/Modal';
import useHotkey from '@/hooks/useHotkey';
import useModalDisappear from '@/hooks/useModalDisappear';
import { Column, Flex, Grid, Row } from '@/components/layout';
import styles from './styles.module.scss';
import classNames from 'classnames';
import HistoryItem from './HistoryItem';
import { HistoryData } from './types';
import { useHistoryStore } from '@/stores/useHistoryStore';

const enum NewRTModalStep {
    SelectRTType = 0,
    EditMetadata = 1,
}

type NewRTModalProps = {
    isFocused: boolean;
    onClose: () => void;
}

function HistoryModal({
    isFocused,
    onClose = ()=>{},
}:NewRTModalProps) {
    const { t } = useTranslation();
    const [disappear, close] = useModalDisappear(onClose);
    const { api } = useProfileAPIStore();
    const {
        last_session_id,
        history_search_scope,
        update : updateCacheState,
    } = useCacheStore();
    const getHistoryStore = useHistoryStore(state=>state.get);

    // const currentSessionHistory = get(last_session_id);
    const [history, setHistory] = useState<HistoryData[]>([]);

    useEffect(()=>{
        (async () => {
            if (!last_session_id) return;

            const { actions } = getHistoryStore(last_session_id).getState();
            await actions.selectMetadata(0, 100);
    
            const sessionAPI = api.getSessionAPI(last_session_id);
            const metadatas = await sessionAPI.getHistoryMetadata();
            const messages = await sessionAPI.getHistoryMessage(metadatas.map(m=>m.id));
            
            console.log('history', messages);
        })();
    }, [last_session_id])

    useHotkey({
        'Escape' : close,
    }, isFocused, []);

    return (
        <Modal
            disappear={disappear}
            style={{
                minWidth: '80%',
                height: '80%',
            }}
        >
            <Grid
                className={styles['history-container']}
                columns='1fr'
                rows='2.5em 0.5em 1.5em 0.75em 1fr'
                style={{
                    height: '100%',
                }}
            >
                <ModalHeader onClose={close}>
                    {t('history.title')}
                </ModalHeader>
                <div/>
                <Row
                    style={{
                        gap: '0.5em',
                    }}
                >
                    {/* <Dropdown
                        style={{
                            height: '100%',
                        }}
                        items={[
                            { key: 'current', name: '현재 세션' },
                            { key: '1', name: '세션 1' },
                            { key: '2', name: '세션 2' },
                        ]}
                        value='current'
                    /> */}
                    <Flex/>
                    {/* <input
                        type='date'
                    /> */}
                    <select
                        value={history_search_scope}
                        onChange={(e)=>{
                            updateCacheState.history_search_scope(e.target.value as 'any'|'input'|'output');
                        }}
                    >
                        <option value='any'>입력 + 출력</option>
                        <option value='input'>입력</option>
                        <option value='output'>출력</option>
                    </select>
                    <input
                        className={classNames(styles['search-input'])}
                        type='text'
                    />
                </Row>
                <div/>
                <Column
                    className={classNames(styles['history-list'], 'undraggable')}
                    style={{
                        width: '100%',
                        maxHeight: '100%',
                        height: '100%',
                        overflowY: 'auto',
                    }}
                >
                    {
                        history.map((item, index) => (
                            <HistoryItem
                                key={`${item.id}`}
                                value={item}
                                onClick={()=>{}}
                            />
                        ))
                    }
                </Column>
            </Grid>
        </Modal>
    )
}

export default HistoryModal;
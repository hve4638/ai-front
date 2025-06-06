import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCacheStore, useProfileAPIStore, useProfileEvent, useSessionStore, useSignalStore } from '@/stores';
import { useHistoryStore } from '@/stores/useHistoryStore';
import { Modal, ModalHeader } from '@/components/Modal';
import { Align, Column, Flex, Grid, Row } from '@/components/layout';
import useModalDisappear from '@/hooks/useModalDisappear';
import useLazyThrottle from '@/hooks/useLazyThrottle';
import useHotkey from '@/hooks/useHotkey';

import styles from './styles.module.scss';
import classNames from 'classnames';
import HistoryItem from './HistoryItem';
import { HistoryData } from '@/features/session-history';
import useSignal from '@/hooks/useSignal';

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
    const historyState = useHistoryStore();
    const updateSessionState = useSessionStore(state=>state.update);
    const [refreshHistoryPing, refreshHistory] = useSignal();
    const {
        last_session_id,

        history_search_scope,
        history_apply_rt,
        history_apply_model,
        history_apply_form,
        update : updateCacheState,
    } = useCacheStore();
    const {
        deleteHistoryMessage
    } = useProfileEvent();
    const { signal } = useSignalStore();

    const [searchTextInstant, setSearchTextInstant] = useState<string>('');
    const [searchText, setSearchText] = useState<string>('');

    const setSearchTextThrottle = useLazyThrottle(()=>{
        setSearchText(searchTextInstant);
    }, 250)

    const [history, setHistory] = useState<HistoryData[]>([]);
    
    useEffect(()=>{
        if (!last_session_id) return;

        const historyCache = historyState.get(last_session_id);
        if (searchText.length === 0) {
            historyCache.select(0, 100, true)
                .then((result) => {
                    setHistory(result);  
                });
        }
        else {
            historyCache.search(0, 100, { text : searchText, searchScope : history_search_scope })
                .then((result) => {
                    setHistory(result);
                });
        }
    }, [last_session_id, searchText, history_search_scope, refreshHistoryPing])

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
                rows='2.5em 0.5em 1.5em 0.75em 1fr 1.5em'
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
                    <Flex/>
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
                        onChange={(e)=>{
                            setSearchTextInstant(e.target.value);
                            setSearchTextThrottle();
                        }}
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
                                key={`${item.id}_${index}`}
                                value={item}
                                onClick={async ()=>{
                                    const promises:Promise<void>[] = [];
                                    promises.push(updateSessionState.input(item.input ?? ''));
                                    promises.push(updateSessionState.output(item.output ?? ''));
                                    if (history_apply_rt) {
                                        promises.push(updateSessionState.rt_id(item.rtId));
                                    }
                                    if (history_apply_model) {
                                        promises.push(updateSessionState.model_id(item.modelId));
                                    }
                                    await Promise.all(promises);

                                    signal.reload_input();
                                    close();
                                }}
                                onDelete={async ()=>{
                                    await deleteHistoryMessage(item.id, 'both');
                                    refreshHistory();
                                }}
                            />
                        ))
                    }
                </Column>
                <Row
                    style={{
                        boxSizing : 'border-box',
                        padding : '0.5em 0em 0em 0em',
                        height : '100%',
                        gap : '1em',
                    }}
                    columnAlign={Align.Center}
                >
                    <LabeledCheckbox
                        checked={history_apply_model}
                        onChange={()=>{
                            updateCacheState.history_apply_model(!history_apply_model);
                        }}
                    >모델 복사</LabeledCheckbox>
                    <LabeledCheckbox
                        checked={history_apply_rt}
                        onChange={()=>{
                            updateCacheState.history_apply_rt(!history_apply_rt);
                        }}
                    >요청 템플릿 복사</LabeledCheckbox>
                    <LabeledCheckbox
                        checked={history_apply_form}
                        onChange={()=>{
                            updateCacheState.history_apply_form(!history_apply_form);
                        }}
                    >변수 복사</LabeledCheckbox>
                </Row>
            </Grid>
        </Modal>
    )
}

type LabeledCheckboxProps= {
    checked : boolean,
    onChange : () => void,
    children? : React.ReactNode,
}

function LabeledCheckbox({
    checked,
    onChange,
    children=<></>
}:LabeledCheckboxProps) {
    return (
        <Row
            style={{
                height : '100%',
                justifyContent : 'center',
                gap : '0.1em',
            }}
            columnAlign={Align.Center}
        >
            <span>{children}</span>
            <input
                type='checkbox'
                checked={checked}
                onChange={onChange}
                style={{
                    height : '100%',
                    aspectRatio : '1/1',
                }}
            />
        </Row>
    )
}

export default HistoryModal;
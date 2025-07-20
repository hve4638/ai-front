import { useEffect, useMemo, useRef, useState } from 'react';

import { Modal, ModalHeader } from '@/components/Modal';

import useHotkey from '@/hooks/useHotkey';
import useModalDisappear from '@/hooks/useModalDisappear';
import useSignal from '@/hooks/useSignal';
import { Align, Column, Flex, Grid, Row } from '@/components/layout';
import ListView from '@/components/ListView/ListView';
import useErrorLogStore, { LogEntry } from '@/stores/useErrorLogStore';
import classNames from 'classnames';

import styles from './styles.module.scss';
import { GIcon } from '@/components/GoogleFontIcon';

type FormModalProps = {
    isFocused: boolean;
    onClose: () => void;
}

function ErrorLogModal({
    isFocused,
    onClose
}: FormModalProps) {
    const [disappear, close] = useModalDisappear(onClose);
    const scrollAnchorRef = useRef<HTMLDivElement>(null);
    const { log: errorLog, markAsRead, hasUnread } = useErrorLogStore();

    useHotkey({
        'Escape' : close,
    }, isFocused, []);
    
    if (hasUnread) {
        markAsRead();
    }

    useEffect(()=>{
        scrollAnchorRef.current?.scrollIntoView();
    }, [])

    return (
        <Modal
            disappear={disappear}
            style={{
                height: '60%',
            }}
        >
            <Grid
                style={{ height: '100%' }}
                rows='1.5em 1em 1fr'
                columns='1fr'
            >
                <ModalHeader onClose={close}>에러</ModalHeader>
                <div style={{ height: '1em' }} />
                <ListView>
                    {
                        errorLog.map((entry, index) => (
                            <LogEntryItem key={index} entry={entry} />
                        ))
                    }
                    <div ref={scrollAnchorRef}/>
                </ListView>
            </Grid>
        </Modal>
    );
}

interface LogEntryItemProps {
    entry: LogEntry;
}

function LogEntryItem({ entry }: LogEntryItemProps) {
    const [showDetail, setShowDetail] = useState(false);
    const occured = useMemo(() => {
        if (entry.occurredAt.type === 'global') {
            return 'global';
        } else if (entry.occurredAt.type === 'session') {
            return `세션 (${entry.occurredAt.sessionId})`;
        } else {
            return 'unknown';
        }
    }, [entry.occurredAt]);

    return (
        <Column
            className={classNames(styles['log-entry'])}
            onClick={() => setShowDetail(!showDetail)}
        >
            <Row
                style={{ gap: '0.25em', width: '100%' }}
                columnAlign={Align.Center}
            >
                {
                    showDetail
                        ? <GIcon value='arrow_drop_down' />
                        : <GIcon value='arrow_right' />
                }
                <span>{entry.message}</span>
                <Flex />

            </Row>
            <span style={{ height: '0.15em' }} />
            <small className='secondary-color' style={{ paddingLeft: '0.25em' }}>발생: {occured}</small>
            {
                showDetail && entry.detail.length > 0 &&
                <Column style={{ padding: '0.25em 1em', fontSize: '0.85em' }}>
                    {
                        entry.detail.map((detail, index) => (
                            <div key={index}>
                                {detail}
                            </div>
                        ))
                    }
                </Column>
            }
        </Column>
    )
}

export default ErrorLogModal;
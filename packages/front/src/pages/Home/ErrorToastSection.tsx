import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import { Align, Column, Row } from '@/components/layout';
import { GIcon, GIconButton } from '@/components/GoogleFontIcon';

import { useModal } from '@/hooks/useModal';
import ErrorLogModal from '@/modals/ErrorLogModal';

import styles from './styles.module.scss';
import useErrorLogStore, { LogEntry } from '@/stores/useErrorLogStore';
import useModalDisappear from '@/hooks/useModalDisappear';

function ErrorToastSection() {
    const modal = useModal();
    const countRef = useRef(0);
    const [messages, setMessages] = useState<{ title: string, description: string, type: 'error', id: number }[]>([]);

    const addToast = (entry:LogEntry) => {
        const id = countRef.current++;
        setMessages((prev) => [
            ...prev,
            {
                title: '요청이 실패했습니다',
                description: entry.message,
                type: 'error',
                id: id,
            }
        ]);
    }

    const removeToast = (id: number) => {
        setMessages(prev=>prev.filter((msg) => msg.id !== id));
    }

    useEffect(() => {
        const unsubscribes = [
            useErrorLogStore.subscribe(
                state => state.last,
                (last) => {
                    if (!last) return;
                    addToast(last);
                }
            )
        ]
        return () => unsubscribes.forEach(unsub => unsub());
    }, []);

    return (
        <Column
            style={{
                position: 'absolute',
                top: '40px',
                right: '0',
                zIndex: 100,
                margin: '6px',
                gap: '4px',
            }}
        >
            {
                messages.map(({ title, description, id }, index) => (
                    <ErrorToast
                        key={id}
                        title={title}
                        description={description}

                        onClick={() => {
                            modal.open(ErrorLogModal, {});
                        }}
                        onDispose={() => removeToast(id)}
                    />
                ))
            }
        </Column>
    )
}

interface ErrorToastProps {
    title: string;
    description: string;
    onClick: () => void;
    onDispose: () => void;
}

function ErrorToast({ title, description, onClick, onDispose }: ErrorToastProps) {
    const [disappear, close] = useModalDisappear(onDispose);

    useEffect(() => {
        const timer = setTimeout(() => {
            close();
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <Row
            className={classNames(
                styles['error-toast'],
                'undraggable',
                { disappear }
            )}
            columnAlign={Align.Center}
            onClick={(e) => {
                onClick();
                close();
                e.stopPropagation();
            }}
        >
            <GIcon style={{ fontSize: '1.5em' }} value='error' />
            <Column
                // style={{ width : '100%' }}
            >
                <span style={{ width: '100%' }}>{title}</span>
                <small className={styles['description']}>{description}</small>
            </Column>

            <GIconButton
                className={styles['close-button']}
                value='close'
                onClick={(e) => {
                    close();
                    e.stopPropagation();
                }}
            />
        </Row>
    )
}

export default ErrorToastSection;
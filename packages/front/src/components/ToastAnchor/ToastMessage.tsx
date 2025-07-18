import { useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';

import { Align, Column, Row } from '@/components/layout';
import { GIcon, GIconButton } from '@/components/GoogleFontIcon';
import useModalDisappear from '@/hooks/useModalDisappear';


import styles from './styles.module.scss';

interface ToastMessageProps {
    title: string;
    description: string|null;
    type: 'error' | 'info' | 'success' | 'warn';
    onClick: () => void;
    onDispose: () => void;
}

export function ToastMessage({ title, description, type, onClick, onDispose }: ToastMessageProps) {
    const [disappear, close] = useModalDisappear(onDispose);
    const icon = useMemo(()=>{
        switch (type) {
            case 'error':
                return 'error';
            case 'info':
                return 'info';
            case 'warn':
                return 'warning';
            case 'success':
                return 'check_circle';
        }
    }, [type])

    useEffect(() => {
        const timer = setTimeout(() => {
            close();
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <Row
            className={classNames(
                styles['toast-message'],
                'undraggable',
                {
                    disappear: disappear,
                    [styles['error-toast']] : type === 'error',
                    [styles['info-toast']] : type === 'info',
                    [styles['warning-toast']] : type === 'warn',
                },
            )}
            columnAlign={Align.Center}
            onClick={(e) => {
                onClick();
                close();
                e.stopPropagation();
            }}
        >
            <GIcon style={{ fontSize: '1.5em' }} value={icon} />
            <Column>
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

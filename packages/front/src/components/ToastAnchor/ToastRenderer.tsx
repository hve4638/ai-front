import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import { Align, Column, Row } from '@/components/layout';

import { useModal } from '@/hooks/useModal';
import ErrorLogModal from '@/modals/ErrorLogModal';

import useToastStore, { Toast } from '@/stores/useToastStore';
import { ToastMessage } from './ToastMessage';

type ToastWithId = Toast & { id: number };

interface ToastRendererProps {
    top?: string;
    right?: string;
    left?: string;
    bottom?: string;
}

function ToastRenderer({
    top, right, left, bottom
}: ToastRendererProps) {
    const modal = useModal();
    const countRef = useRef(0);
    const [messages, setMessages] = useState<ToastWithId[]>([]);

    const addToast = (entry:Toast) => {
        const id = countRef.current++;
        setMessages((prev) => [
            {
                ...entry,
                id: id,
            },
            ...prev,
        ]);
    }

    const removeToast = (id: number) => {
        setMessages(prev=>prev.filter((msg) => msg.id !== id));
    }

    useEffect(() => {
        const unsubscribes = [
            useToastStore.subscribe(
                state => state.toast,
                (toast) => {
                    if (!toast) return;
                    addToast(toast);
                }
            )
        ]
        return () => unsubscribes.forEach(unsub => unsub());
    }, []);

    return (
        <Column
            style={{
                position: 'absolute',
                top,
                right,
                left,
                bottom,
                margin: '6px',
                gap: '4px',
                zIndex: 100,
            }}
        >
            {
                messages.map(({ title, description, id, type }, index) => (
                    <ToastMessage
                        key={id}
                        title={title}
                        description={description}
                        type={type}

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

export default ToastRenderer;
import { useEffect, useMemo, useRef } from 'react';
import classNames from 'classnames';
import styles from './styles.module.scss';

import { useSessionStore, useHistoryStore } from '@/stores';

import ProfileEvent from '@/features/profile-event';
import { HistoryData } from '@/features/session-history';

import { Align, Flex, Row } from '@/components/layout';
import { GIconButton } from '@/components/GoogleFontIcon';
import MarkdownArea from '@/components/MarkdownArea';

import { useModal } from '@/hooks/useModal';

import { DeleteConfirmDialog } from '@/modals/Dialog';
import { CommonProps } from '@/types';


interface ChatDivProps extends CommonProps {
    side: 'input' | 'output';
    value: string;
    data: HistoryData
}

function ChatDiv({
    className = '',
    style = {},
    side,
    value,
    data
}: ChatDivProps) {
    const divRef = useRef<HTMLDivElement>(null);
    const sideClass = side === 'input' ? styles['input-side'] : styles['output-side'];
    const markdown = useSessionStore(state => state.markdown);
    
    const markdownEnabled = useMemo(() => {
        return side === 'output' && markdown;
    }, [side, markdown]);

    return (
        <div
            className={classNames(sideClass, className)}
            style={style}
            ref={divRef}
            tabIndex={-1}
            onFocus={() => {
            }}
            onKeyDown={(e) => {
                if (e.key === 'a' && e.ctrlKey) {
                    if (divRef.current) {
                        const range = document.createRange();
                        range.selectNodeContents(divRef.current);

                        const selection = window.getSelection();
                        if (selection) {
                            selection.removeAllRanges();
                            selection.addRange(range);
                        }
                    }

                    e.preventDefault();
                }
            }}
        >
            {
                !markdownEnabled &&
                value.split('\n').map((line, index) => (
                    <div key={index}>{line}</div>
                ))
            }
            {
                markdownEnabled &&
                <MarkdownArea
                    content={value}
                />
            }
            {
                side === 'input' &&
                <Row style={{ gap: '0.25em', fontSize: '1.15em' }}>
                    <Flex />
                    <CopyButton text={value} />
                    <DeleteButton data={data} origin='in' />
                </Row>
            }
            {
                side === 'output' &&
                <Row
                    style={{ gap: '0.25em', fontSize: '1.15em', height: '1.15em', overflow: 'hidden' }}
                    columnAlign={Align.Center}
                >
                    <Flex />
                    <small
                        className={classNames(styles['output-info-button'], 'secondary-color', 'undraggable')}
                        style={{ cursor: 'pointer' }}
                    >{ProfileEvent.model.getName(data.modelId)}</small>
                    <MarkdownButton />
                    <CopyButton text={value} />
                    <DeleteButton data={data} origin='out' />
                </Row>
            }
        </div>
    )
}

function MarkdownButton() {
    const sessionState = useSessionStore();

    return (
        <GIconButton
            className={
                classNames(
                    { [styles['markdown-enabled']]: sessionState.markdown },
                )
            }
            style={{
                fontSize: '1.15em',
            }}
            value='markdown'
            hoverEffect='square'
            onClick={() => {
                sessionState.update.markdown(!sessionState.markdown);
            }}
        />
    )
}
function CopyButton({ text }: { text: string }) {
    return (
        <GIconButton
            value='content_paste'
            hoverEffect='square'
            onClick={(e) => {
                e.stopPropagation();

                navigator.clipboard.writeText(text);
            }}
        />
    )
}

function DeleteButton({ data, origin }: { data: HistoryData, origin: 'in' | 'out' }) {
    const modal = useModal();
    const historyState = useHistoryStore();
    return (
        <GIconButton
            value='delete'
            hoverEffect='square'
            onClick={(e) => {
                e.stopPropagation();

                modal.open(DeleteConfirmDialog, {
                    onDelete: async () => {
                        await historyState.actions.deleteMessage(data.id, origin);

                        return true;
                    }
                });
            }}
        />
    )
}

function RefreshButton() {
    return (
        <GIconButton
            value='refresh'
            hoverEffect='square'
            onClick={(e) => {
                e.stopPropagation();
            }}
        />
    )
}

export default ChatDiv;
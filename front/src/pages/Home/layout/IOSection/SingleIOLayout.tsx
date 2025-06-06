import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';


import InputField from '@/components/InputField';
import { GIconButton, GoogleFontIcon } from '@/components/GoogleFontIcon';
import { Grid, Row } from '@/components/layout';

import { useConfigStore, useSessionStore, useSignalStore } from '@/stores';

import SplitSlider from '../SplitSlider';

import { useHistoryStore } from '@/stores/useHistoryStore';
import { HistoryData } from '@/features/session-history';
import styles from './styles.module.scss';

type SingleIOLayoutProps = {
    inputText: string;
    onChangeInputText: (text: string) => void;

    color: string;
    tokenCount?: number;
}

function SingleIOLayout({
    inputText,
    onChangeInputText,
    color,
    tokenCount = 0,
}: SingleIOLayoutProps) {
    const configState = useConfigStore();
    const sessionState = useSessionStore();
    const lastSessionId = useSessionStore(state => state.deps.last_session_id);
    const sessionHistory = useMemo(() => {
        const historyState = useHistoryStore.getState();

        if (lastSessionId) {
            return historyState.get(lastSessionId);
        }
        else {
            return null;
        }
    }, [lastSessionId]);
    const [last, setLast] = useState<HistoryData | null>(null);

    let [left, right] = useConfigStore(state => state.textarea_io_ratio);

    const textareaSectionRef = useRef(null);
    const textAreaBorderRadius = `${configState.textarea_radius}px`;

    const gridWH = useMemo(() => {
        const sub = '1fr';
        const main = `${left}fr ${right}fr`

        if (configState.layout_mode == 'horizontal') {
            return { rows: sub, columns: main }
        }
        else if (configState.layout_mode == 'vertical') {
            return { rows: main, columns: sub }
        }
        else {
            return { rows: sub, columns: main }
        }
    }, [configState.layout_mode, left, right]);

    const textareaPadding = configState.textarea_padding;
    const calcPadding = (side: 'left' | 'right' | 'top' | 'down') => {
        const pad = configState.textarea_padding;

        switch (side) {
            case 'left':
                return [8, pad / 2, pad, pad] as [number, number, number, number];
            case 'right':
                return [8, pad, pad, pad / 2] as [number, number, number, number];
            case 'top':
                return [8, pad, pad / 2, pad] as [number, number, number, number];
            case 'down':
                return [pad / 2, pad, pad, pad] as [number, number, number, number];
        }
    };

    const layoutMode = configState.layout_mode;
    const inputMargin = useMemo(() => {
        const m = (
            layoutMode === 'horizontal'
                ? calcPadding('left')
                : calcPadding('top')
        );
        return `${m[0]}px ${m[1]}px ${m[2]}px ${m[3]}px`;
    }, [configState.layout_mode, textareaPadding]);
    const outputMargin = useMemo(() => {
        const m = (
            layoutMode === 'horizontal'
                ? calcPadding('right')
                : calcPadding('down')
        );
        return `${m[0]}px ${m[1]}px ${m[2]}px ${m[3]}px`;
    }, [configState.layout_mode, textareaPadding]);


    useEffect(() => {
        const unsubscribes = [
            useSignalStore.subscribe(
                (state) => state.refresh_chat,
                async () => {
                    if (!sessionHistory) return;

                    const prev = await sessionHistory.select(0, 1, true);
                    if (prev.length === 0) {
                        setLast(null);
                    }
                    else {
                        setLast(prev[0]);
                    }
                }
            )
        ]

        return () => unsubscribes.forEach(unsub => unsub());
    }, [lastSessionId]);

    return (
        <>
            <Grid
                ref={textareaSectionRef}
                className={
                    classNames(
                        styles['main-section'],
                        'row',
                        'flex',
                        'body',
                        'relative',
                        `palette-${color}`
                    )
                }
                style={{
                    overflow: 'hidden',
                    fontSize: `${configState.font_size}px`,
                }}
                rows={gridWH.rows}
                columns={gridWH.columns}
            >
                <InputField
                    className='flex'
                    style={{
                        zIndex: 0,
                        margin: inputMargin,
                        borderRadius: textAreaBorderRadius,
                    }}
                    text={inputText}
                    onChange={(text: string) => onChangeInputText(text)}
                >
                    <small
                        className={classNames('secondary-color', 'undraggable')}
                        style={{
                            position: 'absolute',
                            left: '10px',
                            bottom: '10px',
                            padding: '0em 0.4em',
                            fontSize: '0.8rem',
                        }}
                    >token: {tokenCount}</small>
                    <GoogleFontIcon
                        className='floating-button'
                        value='send'
                        style={{
                            cursor: 'pointer',
                            fontSize: '40px',
                            position: 'absolute',
                            right: '10px',
                            bottom: '10px',
                        }}
                        onClick={() => {
                            sessionState.actions.request();
                        }}
                    />
                </InputField>
                <InputField
                    className='flex'
                    style={{
                        zIndex: 0,
                        margin: outputMargin,
                        borderRadius: textAreaBorderRadius,
                    }}
                    text={sessionState.output ?? ''}
                    onChange={() => { }}
                    tabIndex={-1}
                    markdown={sessionState.markdown}
                >
                    {
                        last !== null &&
                        <small
                            className={classNames(styles['output-info-button'], 'secondary-color', 'undraggable')}
                            style={{
                                position: 'absolute',
                                left: '10px',
                                bottom: '10px',
                                cursor: 'pointer',
                                padding: '0em 0.4em',
                                fontSize: '0.8rem',
                            }}
                        >{last.modelId}</small>
                    }
                    <Row
                        className={classNames('undraggable')}
                        style={{
                            position: 'absolute',
                            right: '10px',
                            bottom: '10px',
                            fontSize: '1rem',
                            gap: '0.25rem',
                        }}
                    >
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
                        <GIconButton
                            style={{
                                fontSize: '1.15em'
                            }}
                            value='content_paste'
                            hoverEffect='square'
                        />
                        <GIconButton
                            style={{
                                fontSize: '1.15em'
                            }}
                            value='edit'
                            hoverEffect='square'
                        />
                    </Row>
                </InputField>
                <SplitSlider
                    containerRef={textareaSectionRef}
                />
            </Grid>
        </>
    )
}

export default SingleIOLayout;
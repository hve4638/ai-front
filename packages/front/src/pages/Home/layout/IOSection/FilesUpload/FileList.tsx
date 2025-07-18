import { CommonProps } from '@/types';
import classNames from 'classnames';
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Align, Row } from '@/components/layout';
import { GIcon, GIconButton } from '@/components/GoogleFontIcon';
import { useSessionStore } from '@/stores';
import styles from './styles.module.scss';
import useDiff from '@/hooks/useDiff';
import { clamp } from '@/utils/math';

interface FilesFormLayoutProps extends CommonProps {
    internalPadding?: string;
}

function FileList({
    className,
    style,
    internalPadding = '0',
}: FilesFormLayoutProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const [fileTooltip, setFileTooltip] = useState<{ index: number, filename: string, position: { x: number, y: number } } | null>(null);
    const inputFiles = useSessionStore((state) => state.input_files);
    const [updateMove] = useDiff(0);
    const [dragging, setDragging] = useState(false);
    const [x, setX] = useState(0);
    const [maxX, setMaxX] = useState(0);

    const onRemove = (inputFile: InputFilePreview, index: number) => {
        const updated = [...inputFiles]
        updated.splice(index, 1);
        useSessionStore.getState().actions.updateInputFiles(updated);
    };

    useLayoutEffect(() => {
        if (!listRef.current || !containerRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const listRect = listRef.current.getBoundingClientRect();

        setMaxX(Math.max(0, listRect.width - containerRect.width));
    }, [listRef.current]);

    useEffect(() => {
        if (!dragging) return;

        const mouseMoveHandler = (e: MouseEvent) => {
            const diff = updateMove(e.clientX);
            setX(prev => {
                const to = prev + diff;
                return clamp(to, -maxX, 0);
            });
        }
        const mouesUpHandler = () => {
            setDragging(false);
        }

        window.addEventListener('mousemove', mouseMoveHandler);
        window.addEventListener('mouseup', mouesUpHandler);

        return () => {
            window.removeEventListener('mousemove', mouseMoveHandler);
            window.removeEventListener('mouseup', mouesUpHandler);
        }
    }, [dragging]);

    if (inputFiles.length === 0) {
        return <></>;
    }

    return (
        <div
            ref={containerRef}
            className={classNames(styles['files-form-container'], className, 'undraggable')}
            style={style}
        >
            <Row
                ref={listRef}
                className={classNames(styles['file-list'])}
                style={{
                    left: `${x}px`,
                    padding: internalPadding,
                }}
                columnAlign={Align.Center}
                onMouseDown={(e) => {
                    setDragging(true);
                    updateMove(e.clientX);
                }}
            >
                {
                    inputFiles.map((inputFile, i) => {
                        if (inputFile.type.startsWith('image/')) {
                            return <FilePreview
                                key={inputFile.hash_sha256 + String(i)}
                                inputFile={inputFile}
                                onRemove={() => onRemove(inputFile, i)}
                                onHover={(hovered, position) => {
                                    if (hovered) {
                                        setFileTooltip({ index: i, filename: inputFile.filename, position });
                                    }
                                    else if (fileTooltip?.index === i) {
                                        setFileTooltip(null);
                                    }
                                }}
                            />;
                        }
                        else {
                            return <FilePreview
                                key={inputFile.hash_sha256 + String(i)}
                                inputFile={inputFile}
                                onRemove={() => onRemove(inputFile, i)}
                                onHover={(hovered, position) => {
                                    if (hovered) {
                                        setFileTooltip({ index: i, filename: inputFile.filename, position });
                                    }
                                    else if (fileTooltip?.index === i) {
                                        setFileTooltip(null);
                                    }
                                }}
                            />
                        }
                    })
                }
            </Row>
            <FilenameTooltip
                show={fileTooltip !== null}
                text={fileTooltip?.filename}
                position={fileTooltip?.position}
            />
        </div>
    );
}

interface FilePreviewProps {
    inputFile: InputFilePreview;
    onRemove: () => void;
    onHover: (hovered: boolean, position: { x: number, y: number }) => void;
}

function FilePreview({ inputFile, onRemove, onHover }: FilePreviewProps) {
    const [hovered, setHovered] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const hover = (enabled: boolean) => {
        setHovered(enabled);
        if (enabled) {
            if (ref.current) {
                const rect = ref.current.getBoundingClientRect();

                onHover(true, {
                    x: rect.left,
                    y: rect.top,
                });
            }
        }
        else {
            onHover(false, { x: 0, y: 0 });
        }
    };

    return (
        <div
            ref={ref}
            className={styles['uploaded-file']}
            style={{
                height: '100%',
                aspectRatio: '1 / 1',
                fontSize: '2rem',
            }}
            onMouseEnter={(e) => hover(true)}
            onMouseLeave={(e) => hover(false)}
        >
            {
                inputFile.thumbnail !== null &&
                <img src={inputFile.thumbnail} />
            }
            {
                inputFile.thumbnail === null &&
                <GIcon
                    value='article'
                    style={{
                        fontSize: '2rem',
                    }}
                />
            }
            <div className={styles['fade']}></div>
            <div
                className={classNames(styles['close'], { [styles['hovered']]: hovered })}
                onClick={(e) => {
                    onRemove();
                    hover(false);
                    e.stopPropagation();
                    e.preventDefault();
                }}
            >
                <GIcon value='close' />
            </div>
        </div>
    )
}

interface FilenameTooltipProps {
    show: boolean;
    text?: string;
    position?: {
        x: number;
        y: number;
    };
}

function FilenameTooltip({ show, text, position }: FilenameTooltipProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [currentText, setCurrentText] = useState('');
    const [currentX, setCurrentX] = useState(0);
    const [currentY, setCurrentY] = useState(0);
    const [rectHeight, setRectHeight] = useState(0);

    useLayoutEffect(() => {
        if (text) {
            setCurrentText(text);
        }
        if (position) {
            setCurrentX(position.x);
            setCurrentY(position.y);
        }

        const r = ref.current?.getBoundingClientRect();
        setRectHeight(r?.height ?? 0);
    }, [text, position]);

    return (
        <div
            ref={ref}
            className={
                classNames(
                    styles['filename-tooltip'],
                    { [styles['show']]: show },
                )
            }
            style={{
                left: `${currentX}px`,
                top: `${(currentY) - rectHeight - 12}px`,
            }}
        >
            <span>{currentText}</span>
        </div>
    );
}

export default FileList;
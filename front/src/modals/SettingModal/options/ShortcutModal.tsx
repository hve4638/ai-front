import useHotkey from '@/hooks/useHotkey';
import classNames from 'classnames';
import Button from 'components/Button';
import { Modal, ModalHeader } from 'components/Modal';
import { Align, Center, Column, Flex, Grid, Row } from 'components/layout';
import { MODAL_DISAPPEAR_DURATION } from 'data';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Shortcut } from 'types/shortcut';
import { getKeyType, isKeyCodeChar, KEY_TYPE, mapKeyCode } from 'utils/keycode-map';
import { shortcutToText } from 'utils/shortcut';

const hasSpecialKey = (shortcut:Shortcut) => {
    return shortcut.ctrl || shortcut.shift || shortcut.alt || shortcut.win;
}

type ShortcutModalProps = {
    initValue?:Shortcut;
    name:string;
    onChange?:(shortcut:Shortcut)=>void;
    onClose?:()=>void;
}

function ShortcutModal({
    initValue = {},
    name,
    onChange = () => {},
    onClose = () => {},
}:ShortcutModalProps) {
    const [disappear, setDisappear] = useState(true);
    const [focus, setFocus] = useState(false);
    const [shortcut, setShortcut] = useState<Shortcut>(initValue);
    const shortcutText = useMemo(()=>shortcutToText(shortcut), [shortcut]);
    const validShortcut = useMemo(()=>{
        if (shortcut.click) return true;
        if (shortcut.wheel) return hasSpecialKey(shortcut);
        if (shortcut.key) {
            const keyCode = shortcut.key;
            const keyType = getKeyType(keyCode);

            switch (keyType) {
                case KEY_TYPE.FUNCTION:
                    return true;
                case KEY_TYPE.ARROW:
                case KEY_TYPE.NUMBER:
                    return hasSpecialKey(shortcut);
                case KEY_TYPE.CONTROL:
                    // Tab, Enter, Space, Escape, CapsLock, Backspace
                    switch (keyCode) {
                        case 'Tab':
                        case 'Backspace':
                            return true;
                        default:
                            return hasSpecialKey(shortcut);
                    }
                case KEY_TYPE.SYSTEM:
                    // Pause, ScrollLock, PageUp, PageDown 등
                    switch (keyCode) {
                        case 'Insert':
                        case 'Pause':
                        case 'ScrollLock':
                        case 'PageUp':
                        case 'PageDown':
                            return true;
                        default:
                            return hasSpecialKey(shortcut);
                    }
                default:
                    return hasSpecialKey(shortcut);
            }
        }
        return false;
    }, [shortcut]);

    const handleKeyDown = (e:React.KeyboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.key === 'Escape') {
            onClose();
            return;
        }
        if (e.key === 'Control') return;
        if (e.key === 'Shift') return;
        if (e.key === 'Meta') return;
        if (e.key === 'Alt') return;

        const newShortcut:Shortcut = {
            key : e.code,
            ctrl : e.ctrlKey,
            shift : e.shiftKey,
            alt : e.altKey,
            win : e.metaKey,
        }
        setShortcut(newShortcut);
    }
    const handleWheel = (e:WheelEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.deltaY === 0) return;
        const newShortcut:Shortcut = {
            wheel : Math.sign(e.deltaY) as (1|-1),
            ctrl : e.ctrlKey,
            shift : e.shiftKey,
            alt : e.altKey,
            win : e.metaKey,
        }
        setShortcut(newShortcut);
    }
    const handleMouseDown = (e:MouseEvent) => {
        if (e.button >= 3) {
            e.preventDefault();
            e.stopPropagation();
            console.log(e.button);

            const newShortcut:Shortcut = {
                click : e.button as (3|4),
                ctrl : e.ctrlKey,
                shift : e.shiftKey,
                alt : e.altKey,
                win : e.metaKey,
            }
            setShortcut(newShortcut);
        }
    }

    useHotkey({
        'Escape' : ()=>{
            onClose();
            return true;
        }
    }, true, [onClose])

    useEffect(() => {
        setDisappear(false);
    }, []);

    useEffect(()=>{
        if (!focus) return;
        addEventListener('wheel', handleWheel);
        addEventListener('mousedown', handleMouseDown);

        return () => {
            removeEventListener('wheel', handleWheel);
            removeEventListener('mousedown', handleMouseDown);
        }
    }, [focus]);

    const close = () => {
        setDisappear(true);

        setTimeout(()=>onClose(), MODAL_DISAPPEAR_DURATION);
    }

    return (
        <Modal
            disappear={disappear}
            className='shortcut-modal'
            backgroundStyle={{
                borderRadius: '5px',
            }}
            style={{
                width: '60%',
                minHeight: '230px',
            }}
        >
            <Grid
                columns='1fr'
                rows='48px 32px 1fr'
                style={{
                    height: '100%',
                    minHeight: '220px',
                }}
            >
                <ModalHeader className='noflex' onClose={close}>단축키 설정</ModalHeader>
                <span className='shortcut-description undraggable'> </span>
                <Column
                    columnAlign={Align.Center}
                    rowAlign={Align.Center}
                    style={{
                        height: '100%',
                    }}
                >
                    <div
                        className='undraggable'
                        style={{
                            fontSize: '0.95em',
                            marginBottom: '8px',
                        }}
                    >{name}</div>
                    <input
                        type='text'
                        className='shortcut-input undraggable center clickable'
                        style={{
                            width: 'auto',
                            minWidth: '8em',
                        }}
                        value={shortcutText}
                        onChange={(e)=>{ /* nothing to do */ }}
                        
                        onKeyDown={handleKeyDown}
                        onFocus={()=>setFocus(true)}
                        onBlur={()=>setFocus(false)}
                    />
                    {
                        !validShortcut &&
                        <div
                            className='undraggable'
                            style={{
                                fontSize: '0.6em',
                                marginTop: '6px',
                                color: 'gray',
                            }}
                        >
                            일반 키는 Ctrl, Shift 등 특수키와 조합해야 합니다.
                        </div>
                    }
                    <Flex/>
                    <Row
                        rowAlign={Align.End}
                        style={{
                            width: '100%',
                            height: '32px',
                        }}
                    >
                        <Button
                            className={
                                classNames('green', {disabled:!validShortcut})
                            }
                            style={{
                                width: '96px',
                                height: '100%',
                            }}
                            onClick={()=>{
                                if (!validShortcut) return;

                                onChange(shortcut);
                                close();
                            }}
                        >확인</Button>
                        <div style={{width:'8px'}}/>
                        <Button
                            className='transparent'
                            style={{
                                width: '96px',
                                height: '100%',
                            }}
                            onClick={()=>close()}
                        >취소</Button>
                    </Row>
                </Column>
            </Grid>
        </Modal>
    )
}

export default ShortcutModal;
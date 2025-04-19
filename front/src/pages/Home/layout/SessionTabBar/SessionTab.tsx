import { SpinnerCircular } from 'spinners-react';
import { Align, Center, Column, Flex, Row } from '@/components/layout';
import { GoogleFontIcon } from '@/components/GoogleFontIcon';
import { ProfileSessionMetadata } from '@/types';
import styles from './styles.module.scss';
import classNames from 'classnames';
import { useMemo, useRef, useState } from 'react';
import Popover from '@/components/Popover';
import DivButton from '@/components/DivButton';
import SessionMenuPopover from './SessionMenuPopover';
import SessionName from './SessionName';
import { useProfileAPIStore, useSignalStore } from '@/stores';
import ColorMenuPopover from './ColorMenuPopover';

interface TabCoreProps {
    item : ProfileSessionMetadata;
    widthPx : number;
    selected? : boolean;
    onClick? : () => void;
    onClose? : () => void;
}

function SessionTab({
    item,
    selected=false,
    widthPx,
    onClick = ()=>{},
    onClose = ()=>{},
}:TabCoreProps) {
    const { api } = useProfileAPIStore();
    const sessionAPI = useMemo(()=>api.getSessionAPI(item.id), [item.id]);
    const signal = useSignalStore(state=>state.signal);

    const [showMenu, setShowMenu] = useState(false);
    const [showColorMenu, setShowColorMenu] = useState(false);
    const [renameMode, setRenameMode] = useState(false);

    const hideTitle = widthPx <= 60;
    const hideCloseButton = widthPx <= 60 && !selected;
    const colorStyle = `palette-${item.color ?? 'default'}`;

    return (
    <>
        <div
            className={
                classNames(
                    'absolute',
                    'tab',
                    { [colorStyle]: true },
                    { selected },
                )
            }
            style={{
                width : '100%',
                height : '100%'
            }}
            onMouseDown={(e)=>{
                if (renameMode) {
                    e.stopPropagation();
                    return;
                }

                if (e.button === 0) {
                    onClick();
                }
                else if (e.button === 1) {
                    onClose();
                }
                else if (e.button === 2) {
                    setShowMenu(prev=>!prev);
                }
            }}
        >
            <SessionName
                name={item.name}
                displayName={item.displayName}
                rename={renameMode}
                onEnableRename={()=>setRenameMode(true)}
                onChange={(value)=>{
                    sessionAPI.set('config.json', { name: value });
                    signal.session_metadata();
                    setRenameMode(false);
                }}
                onCancelRename={()=>setRenameMode(false)}
            />
            {
                item.state === 'loading' &&
                <Center
                    style={{
                        marginRight : '0.25em',
                    }}
                >
                    <SpinnerCircular
                        size={'1em'}
                        thickness={100}
                        color='white'
                    />
                </Center>
            }
            <Column
                columnAlign={Align.Center}
            >
                {
                    item.deleteLock &&
                    <GoogleFontIcon
                        value='lock'
                        style={{
                            marginRight: '8px',
                            width: '20px',
                            height: '20px',
                        }}
                    />
                }
                {
                    !item.deleteLock &&
                    hideCloseButton &&
                    <div
                        style={{
                            marginRight: '8px',
                            width: '20px',
                            height: '20px',
                        }}
                    />
                }
                {
                    !item.deleteLock &&
                    !hideCloseButton &&
                    <GoogleFontIcon
                        className='close-button'
                        value='close'
                        style={{
                            marginRight: '8px',
                            width: '20px',
                            height: '20px',
                        }}
                        onClick={(e)=>{
                            onClose();
                        }}
                    />
                }
            </Column>
            {
                showMenu &&
                <SessionMenuPopover
                    item={item}
                    onClickRenameButton={()=>{
                        setRenameMode(true);
                        setShowMenu(false);
                    }}
                    onClickColorButton={()=>{
                        setShowColorMenu(true);
                        setShowMenu(false);
                    }}
                    onClose={()=>setShowMenu(false)}
                />
            }
            {
                showColorMenu &&
                <ColorMenuPopover
                    item={item}
                    onClose={()=>setShowColorMenu(false)}
                />
            }
        </div>
    </>
    );
}

export default SessionTab;
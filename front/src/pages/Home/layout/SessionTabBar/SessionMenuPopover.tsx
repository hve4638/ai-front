import { SpinnerCircular } from 'spinners-react';
import { Align, Center, Column, Flex, Row } from '@/components/layout';
import { GoogleFontIcon } from '@/components/GoogleFontIcon';
import { ProfileSessionMetadata } from '@/types';
import styles from './styles.module.scss';
import classNames from 'classnames';
import { useMemo, useRef, useState } from 'react';
import Popover from '@/components/Popover';
import DivButton from '@/components/DivButton';
import { useProfileAPIStore, useSignalStore } from '@/stores';

type SessionMenuPopoverProps = {
    item : ProfileSessionMetadata;
    onClickRenameButton:()=>void;
    onClickColorButton:()=>void;
    onClose:()=>void;
}

function SessionMenuPopover(props:SessionMenuPopoverProps) {
    const {
        item,
        onClickRenameButton=()=>{},
        onClickColorButton=()=>{},
        onClose=()=>{},
    } = props;
    const { api } = useProfileAPIStore();
    const sessionAPI = useMemo(()=>api.getSessionAPI(item.id), [item.id]);
    const signal = useSignalStore(state=>state.signal);

    return (
        <Popover
            className={
                classNames(
                    'absolute',
                    'popover',
                )
            }
            style={{
                minWidth : '100%',
                maxWidth : '200px',
                zIndex : 5,
            }}
            onClickOutside={(e)=>onClose()}
            onMouseDown={(e)=>{
                e.stopPropagation();
            }}
        >
            <Column
                className={
                    classNames(
                        'popover-card',
                    )
                }
                style={{
                    width: '12em',
                    margin : '0.25em 0em',
                    padding : '0.25em',
                    gap: '0.25em',
                }}
            >
                <Center style={{ width: '100%', }}>{item.name}</Center>
                <MenuItem icon='edit' onClick={()=>onClickRenameButton()}>이름 수정</MenuItem>
                <MenuItem icon='palette' onClick={()=>onClickColorButton()}>색상 변경</MenuItem>
                {
                    item.deleteLock &&
                    <MenuItem icon='lock_open'
                        onClick={async ()=>{
                            await sessionAPI.set('config.json', { delete_lock: false });
                            signal.session_metadata();
                            onClose();
                        }}
                    >삭제 잠금 해제</MenuItem>
                }
                {
                    !item.deleteLock &&
                    <MenuItem icon='lock'
                        onClick={async ()=>{
                            await sessionAPI.set('config.json', { delete_lock: true });
                            signal.session_metadata();
                            onClose();
                        }}
                    >삭제 잠금</MenuItem>
                }
                <MenuItem icon='file_save'>내보내기</MenuItem>
            </Column>
        </Popover>
    )
}

type MenuItemProps = {
    onClick?: () => void;
    icon: string;
    children?: React.ReactNode;
}

function MenuItem({onClick, icon, children}:MenuItemProps) {
    return (
        <DivButton
            onClick={onClick}
            style={{ width : '100%' }}
        >
            <GoogleFontIcon
                value={icon}
                style={{
                    marginRight: '0.25em',
                }}
            />
            <span>{children}</span>
        </DivButton>
    )
}

export default SessionMenuPopover;
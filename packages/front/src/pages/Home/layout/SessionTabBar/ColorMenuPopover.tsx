import { useMemo } from 'react';
import { Align, Center, Column, Grid, } from '@/components/layout';
import { ProfileSessionMetadata } from '@/types';
import classNames from 'classnames';
import Popover from '@/components/Popover';
import { useProfileAPIStore, useSessionStore, useSignalStore } from '@/stores';
import styles from './styles.module.scss';

const SessionColors = [
    'red',
    'orange',
    'yellow',
    'green',
    'sky',
    'blue',
    'purple',
    'default',
]

type SessionMenuPopoverProps = {
    item : ProfileSessionMetadata;
    onClose:()=>void;
}

function ColorMenuPopover(props:SessionMenuPopoverProps) {
    const {
        item,
        onClose=()=>{},
    } = props;
    const { api } = useProfileAPIStore();
    const signal = useSignalStore(state=>state.signal);
    const refetchSessionState = useSessionStore(state=>state.refetch);

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
                columnAlign={Align.Center}
                rowAlign={Align.Center}
            >
                <span>색상 변경</span>
                <Grid
                    columns='repeat(4, 1fr)'
                    rows='1fr'
                    style={{
                        gap: '0.3em',
                        margin: '0.25em 0em',
                    }}
                >
                    {
                        SessionColors.map((color, index)=>(
                            <ColorButton
                                key={index}
                                color={color}
                                onClick={async ()=>{
                                    const sessionAPI = api.getSessionAPI(item.id);
                                    await sessionAPI.set('config.json', { color });
                                    signal.session_metadata();
                                    refetchSessionState.color();
                                }}
                            />
                        ))
                    }
                </Grid>
            </Column>
        </Popover>
    )
}

type ColorButtonProps = {
    color:string;
    onClick:()=>void;
}

function ColorButton(props:ColorButtonProps) {
    return (
        <div
            className={classNames(styles['color-box'], props.color)}
        >
            <div
                className={classNames(styles['color-box-over'])}
                onClick={(e)=>{
                    e.stopPropagation();
                    props.onClick();
                }}
            />
        </div>
    )
}

export default ColorMenuPopover;
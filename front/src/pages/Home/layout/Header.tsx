import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import styles from '../styles.module.scss';

import { Align, Flex, Row } from 'components/layout';
import AvatarPopover from '../AvatarPopover';
import { useModal } from 'hooks/useModal';

import RTDropdown from './RTDropdown';
import ModelDropdown from './ModelDropdown';
import { useSessionStore } from '@/stores';
import classNames from 'classnames';
import { GoogleFontIcon, GoogleFontIconButton } from '@/components/GoogleFontIcon';
import HistoryModal from '@/modals/HistoryModal';

function Header() {
    const modal = useModal();
    const color = useSessionStore(state=>state.color);

    const [showAvatarPopover, setShowAvatarPopover] = useState(false);

    const colorStyle = `palette-${color}`;

    return (
        <header
            id='app-header'
            className={classNames(colorStyle)}
            style={{
                padding: '8px 8px 0px 8px',
                height: '40px',
                fontSize: '16px',
            }}
        >
            <Flex
                style={{
                    margin: '0px 8px',
                }}
            >
                <ModelDropdown/>
                <Flex/>
                <RTDropdown/>
            </Flex>
            
            <Flex
                style={{
                    margin: '0px 8px',
                }}
            >
                <Row
                    className='flex'
                    style={{
                        gap: '0.25em',
                    }}
                    columnAlign={Align.Center}
                >
                    {/* 변수 */}
                    <Flex/>
                    {/* 에러 */}
                    <GoogleFontIcon
                        value='history'
                        enableHoverEffect={true}
                        style={{
                            height: '100%',
                            aspectRatio: '1/1',
                            fontSize: '2em',
                            cursor: 'pointer',
                        }}
                        onClick={()=>{
                            modal.open(HistoryModal, {
                                
                            })
                        }}
                    />
                    <div className={styles['avatar-container']}>
                        <label
                            className={styles['avatar-label']}
                            onClick={()=>{
                                setShowAvatarPopover(prev=>!prev);
                            }}
                        >
                            <div
                                className={styles['avatar']}
                            />
                        </label>
                        {
                            showAvatarPopover &&
                            <AvatarPopover
                                onClose={()=>setShowAvatarPopover(false)}
                            />
                        }
                    </div>
                </Row>
            </Flex>
        </header>
    );
}

export default Header;
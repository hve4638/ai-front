import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import styles from '../styles.module.scss';

import LocalAPI from 'api/local';
import { Align, Flex, Row } from 'components/layout';
import Dropdown, { DropdownItem, DropdownItemList } from 'components/Dropdown';
import {
    OpenAIIcon,
    GoogleIcon,
    AnthropicIcon,
    GoogleVertexAIIcon,
} from 'components/Icons'
import { useTranslation } from 'react-i18next';
import AvatarPopover from '../AvatarPopover';
import { useModal } from 'hooks/useModal';

import SettingModal from 'modals/SettingModal';
import RTEditModal from 'modals/RTEditModal';
import { useConfigStore, useDataStore, useProfileEvent, useSessionStore } from '@/stores';
import RTDropdown from './RTDropdown';
import ModelDropdown from './ModelDropdown';

function Header() {
    const modal = useModal();

    const [showAvatarPopover, setShowAvatarPopover] = useState(false);

    return (
        <header
            id='app-header'
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
                    columnAlign={Align.Center}
                >
                    <Flex/>
                    {/* 변수 */}
                    {/* 에러 */}
                    {/* 기록 */}
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
                                onClickEditRequestTemplate={()=>{
                                    modal.open(RTEditModal, {
                                        onClickCreateNewRT:()=>{
                                            // @TODO
                                        }
                                    });
                                    setShowAvatarPopover(false);
                                }}
                                onClickSetting={()=>{
                                    modal.open(SettingModal, {});

                                    setShowAvatarPopover(false);
                                }}
                                onClickChangeProfile={()=>{
                                    // @TODO
                                }} 

                                onClickOutside={(e)=>setShowAvatarPopover(false)}
                            />
                        }
                    </div>
                </Row>
            </Flex>
        </header>
    );
}

export default Header;
import classNames from 'classnames';

import Popover from '@/components/Popover';
import { Column } from '@/components/layout';
import DivButton from '@/components/DivButton';
import { GoogleFontIcon } from '@/components/GoogleFontIcon';

import { useModal } from '@/hooks/useModal';

import RTEditModal from '@/modals/RTEditModal';
import SettingModal from '@/modals/SettingModal';

import { useSignalStore } from '@/stores';

import styles from './styles.module.scss';
import LocalAPI from '@/api/local';
import useMemoryStore from '@/stores/useMemoryStore';

type AvatarPopoverProps = {
    onClose: () => void;
}

function AvatarPopover({
    onClose,
}:AvatarPopoverProps) {
    const modal = useModal();
    const signal = useSignalStore(state=>state.signal);
    const { availableVersion } = useMemoryStore();

    const clickEditRTButton = () => {
        modal.open(RTEditModal, {});
        onClose();
    }
    
    const clickSettingButton = () => {
        modal.open(SettingModal, {});
        onClose();
    }

    const clickChangeProfileButton = () => {
        signal.change_profile();
    }
    
    return (
        <Popover
            className={
                classNames(
                    styles['avatar-popover'],
                    'undraggable',
                )
            }
            onClickOutside={onClose}
        >
            <Column
                style={{
                    width: '12em',
                    margin : '0.25em 0em',
                    gap: '0.25em',
                }}
            >
                <DivButton
                    onClick={()=>clickSettingButton()}
                    style={{ width : '100%'}}
                >
                    <GoogleFontIcon
                        value='settings'
                        style={{
                            marginRight: '0.25em',
                        }}
                    />
                    <span>설정</span>
                </DivButton>
                <DivButton
                    onClick={()=>clickEditRTButton()}
                    style={{ width : '100%'}}
                >
                    <GoogleFontIcon
                        value='edit_square'
                        style={{
                            marginRight: '0.25em',
                        }}
                    />
                    <span>요청 템플릿 수정</span>
                </DivButton>
                <hr/>
                {
                    availableVersion != null &&
                    <DivButton
                        onClick={()=>{
                            LocalAPI.general.openBrowser(availableVersion.url);
                        }}
                        style={{ width : '100%', color : 'orange' }}
                    >
                        <GoogleFontIcon
                            value='browser_updated'
                            style={{
                                marginRight: '0.25em',
                            }}
                        />
                        <span>새 버전 업데이트</span>
                    </DivButton>
                }
                <hr/>
                <DivButton
                    onClick={()=>clickChangeProfileButton()}
                    style={{ width : '100%'}}
                >
                    <GoogleFontIcon
                        value='account_circle'
                        style={{
                            marginRight: '0.25em',
                        }}
                    />
                    프로필 변경
                </DivButton>
            </Column>
        </Popover>
    )
}

export default AvatarPopover;
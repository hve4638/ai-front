import classNames from 'classnames';
import Popover from 'components/Popover';

import styles from './styles.module.scss';
import { Column } from 'components/layout';
import DivButton from 'components/DivButton';
import { GoogleFontIcon } from 'components/GoogleFontIcon';

type AvatarPopoverProps = {
    onClickOutside: (e:MouseEvent) => void;
    onClickEditRequestTemplate: () => void;
    onClickSetting: () => void;
    onClickChangeProfile: () => void;
}

function AvatarPopover({
    onClickOutside,
    onClickEditRequestTemplate,
    onClickSetting,
    onClickChangeProfile,
}:AvatarPopoverProps) {
    return (
        <Popover
            className={
                classNames(
                    styles['avatar-popover'],
                    'undraggable',
                )
            }
            onClickOutside={onClickOutside}
        >
            <Column
                style={{
                    width: '12em',
                    margin : '0.25em 0em',
                    gap: '0.25em',
                }}
            >
                <DivButton
                    onClick={()=>onClickSetting()}
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
                    onClick={()=>onClickEditRequestTemplate()}
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
                <DivButton
                    onClick={()=>onClickChangeProfile()}
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
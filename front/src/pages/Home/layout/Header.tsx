import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import styles from '../styles.module.scss';

import { Align, Flex, Grid, Row } from 'components/layout';
import AvatarPopover from '../AvatarPopover';
import { useModal } from 'hooks/useModal';

import RTDropdown from './RTDropdown';
import ModelDropdown from './ModelDropdown';
import { useProfileAPIStore, useProfileEvent, useSessionStore, useSignalStore } from '@/stores';
import classNames from 'classnames';
import { GIconButton, GoogleFontIcon } from '@/components/GoogleFontIcon';
import HistoryModal from '@/modals/HistoryModal';
import FormModal from '@/modals/FormModal';

function Header() {
    const modal = useModal();
    const { api } = useProfileAPIStore();
    const color = useSessionStore(state => state.color);
    const rt_id = useSessionStore(state => state.rt_id);

    const [showFormButton, setShowFormButton] = useState(false);

    useEffect(() => {
        api.rt(rt_id).getForms()
            .then(forms => {
                setShowFormButton(forms.length > 0);
            })
    }, [rt_id]);

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
            <Grid
                style={{
                    width : '100%',
                    margin : '0px 8px',
                    gap : '16px',
                }}
                rows='1fr'
                columns='1fr 1fr'
            >
                <div>
                    <ModelDropdown />
                    <Flex />
                    <RTDropdown />
                </div>
                <Row
                    style={{ gap: '0.25em' }}
                    columnAlign={Align.Center}
                >
                    {
                        showFormButton &&
                        <GIconButton
                            value='edit_note'
                            style={{
                                height: '100%',
                                aspectRatio: '1/1',
                                fontSize: '2em',
                            }}
                            hoverEffect='square'
                            onClick={() => {
                                modal.open(FormModal, {})
                            }}

                        />}
                    <Flex />
                    <GIconButton
                        value='error'
                        style={{
                            height: '100%',
                            aspectRatio: '1/1',
                            fontSize: '2em',
                        }}
                        hoverEffect='circle'
                        onClick={() => {
                            modal.open(FormModal, {})
                        }}

                    />
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
                        onClick={() => {
                            modal.open(HistoryModal, {})
                        }}
                    />
                    <div className={styles['avatar-container']}>
                        <label
                            className={styles['avatar-label']}
                            onClick={() => {
                                setShowAvatarPopover(prev => !prev);
                            }}
                        >
                            <div
                                className={styles['avatar']}
                            />
                        </label>
                        {
                            showAvatarPopover &&
                            <AvatarPopover
                                onClose={() => setShowAvatarPopover(false)}
                            />
                        }
                    </div>
                </Row>
            </Grid>
        </header>
    );
}

export default Header;
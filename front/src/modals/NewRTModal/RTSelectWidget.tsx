import { GoogleFontIcon } from 'components/GoogleFontIcon';
import { Modal, ModalHeader } from 'components/Modal';
import { Align, Center, Column, Grid, Row } from 'components/layout';
import useHotkey from 'hooks/useHotkey';
import useModalDisappear from 'hooks/useModalDisappear';
import { useTranslation } from 'react-i18next';
import style from './styles.module.scss';
import classNames from 'classnames';

type RTSelectWidgetProps = {
    onPrev : () => void;
    onSelectRTType : (type:'prompt_only'|'flow') => void;
}

function RTSelectWidget(props:RTSelectWidgetProps) {
    const { t } = useTranslation();

    return (
        <Row
            rowAlign={Align.Center}
            columnAlign={Align.Center}
            style={{
                // minWidth : '400px',
            }}
        >
            <RTTypeButton
                value='description'
                text={t('rt.select_prompt_only_mode_button')}
                onClick={()=>{
                    props.onSelectRTType('prompt_only');
                }}
            />
            <div style={{width:'4px'}}/>
            <RTTypeButton
                value='polyline'
                text={t('rt.select_flow_mode_button')}
                onClick={()=>{
                    props.onSelectRTType('flow');
                }}
            />
        </Row>
    )
}

type RTTypeButtonProps = {
    value : string;
    text : string;
    onClick : () => void;
}

function RTTypeButton({
    value, text, onClick
}:RTTypeButtonProps) {
    return (
        <Grid
            className={
                classNames(
                    style['rt-type-select'],
                    'undraggable'
                )
            }
            columns='120px'
            rows='64px 16px 4px'
            style={{
                padding : '0.5em',
            }}
            onClick={onClick}
            tabIndex={0}
        >
            <Center>
                <GoogleFontIcon
                    style={{
                        height: 'auto',
                        fontSize: '36px',
                    }}
                    value={value}
                />
            </Center>
            <span
                className='flex'
                style={{
                    textAlign: 'center',
                }}
            >
                <small>{text}</small>
            </span>
        </Grid>
    );
}

export default RTSelectWidget;
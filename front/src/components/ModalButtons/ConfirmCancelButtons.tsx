import classNames from 'classnames';
import Button from 'components/Button';
import { Align, Row } from 'components/layout';
import { useTranslation } from 'react-i18next';

function ConfirmCancelButtons({
    onConfirm,
    onCancel,
    enableConfirmButton = true,
    enableCancelButton = true
}:{
    onConfirm:()=>void,
    onCancel:()=>void,
    enableConfirmButton?:boolean
    enableCancelButton?:boolean
}) {
    const { t } = useTranslation();
    
    return (
        <Row
            style={{
                height: '1.4em',
                margin: '0.5em 0.5em'
            }}
            rowAlign={Align.End}
        >
            <Button
                className={classNames('green')}
                style={{
                    width: '96px',
                    height: '100%',
                }}
                onClick={async ()=>{
                    if (enableConfirmButton) {
                        onConfirm();
                    }
                }}
                disabled={!enableConfirmButton}
            >{t('confirm_label')}</Button>
            <div style={{width:'8px'}}/>
            <Button
                className={classNames('transparent')}
                style={{
                    width: '96px',
                    height: '100%',
                }}
                onClick={()=>{
                    if (enableCancelButton) {
                        onCancel();
                    }
                }}
                disabled={!enableCancelButton}
            >{t('cancel_label')}</Button>
        </Row>
    )
}

export default ConfirmCancelButtons;
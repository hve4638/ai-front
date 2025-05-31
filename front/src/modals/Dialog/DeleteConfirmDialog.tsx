import { CommonDialogProps } from './types';
import ChoiceDialog from './ChoiceDialog';
import { useTranslation } from 'react-i18next';

interface ConfirmDialogProps extends CommonDialogProps {
    title?:string;
    contents?:string;

    onDelete?:()=>Promise<boolean>;
    onCancel?:()=>Promise<boolean>;
    enableRoundedBackground?:boolean

    confirmButtonClassName?:string,
    cancelButtonClassName?:string,
}

function DeleteConfirmDialog({
    title,
    contents,

    onDelete = async ()=>true,
    onCancel = async ()=>true,

    isFocused,
    onClose,

    enableRoundedBackground = false,

    className='',
    style={},
}:ConfirmDialogProps) {
    const { t } = useTranslation();

    return (
        <ChoiceDialog
            className={className}
            style={style}
            title = {title ?? '삭제'}
            choices = {[
                { text: t('delete_label'), tone: 'warn' },
                { text: t('cancel_label'), tone: 'dimmed' }
            ]}
            isFocused={isFocused}
            onClose={onClose}
            onSelect={async (choice, index) => {
                if (index === 0) {
                    return await onDelete();
                } else {
                    return onCancel();
                }
            }}
            onEnter={async () => {
                return await onDelete();
            }}

            enableRoundedBackground={enableRoundedBackground}
        >
            {contents ?? '삭제하시겠습니까?'}
        </ChoiceDialog>
    )
}

export default DeleteConfirmDialog;
import classNames from 'classnames';

import { Align, Row } from '@/components/layout';
import { Modal, ModalHeader } from '@/components/Modal';
import Button from '@/components/Button';

import useModalDisappear from '@/hooks/useModalDisappear';

import { CommonDialogProps } from './types';
import styles from './styles.module.scss';
import useHotkey from '@/hooks/useHotkey';

type ChoiceTone = 'default'|'highlight'|'dimmed';
type ChoiceDetail = {
    text : string;
    tone? : ChoiceTone;
};

interface ChoiceDialogProps extends CommonDialogProps {
    choices:(string|ChoiceDetail)[];
    onSelect?:(choice:string, index:number)=>Promise<boolean>;

    onEnter? : ()=>Promise<boolean>;
    onEscape? : ()=>Promise<boolean>;
}

function ChoiceDialog({
    title,
    children,
    choices,
    onSelect = async (choice:string, index:number)=>true,
    onClose,

    onEnter = async ()=>true,
    onEscape = async ()=>true,

    enableRoundedBackground = false,

    className='',
    style={},
}:ChoiceDialogProps) {
    const [disappear, close] = useModalDisappear(onClose);

    useHotkey({
        'Enter' : (e)=>{
            onEnter().then((b)=>{
                if (b) close();
            });

            return true;
        },
        'Escape' : (e)=>{
            onEscape().then((b)=>{
                if (b) close();
            });
            
            return true;
        }
    })

    return (
        <Modal
            className={className}
            style={{
                ...style,
                minWidth: '40%',
                width : 'auto',
            }}
            disappear={disappear}
            enableRoundedBackground={enableRoundedBackground}
        >
            <ModalHeader
                hideCloseButton={true}
            >
                {title}
            </ModalHeader>
            <div
                className='undraggable'
                style={{
                    fontSize: '0.9em',
                    padding: '4px 0.5em 1em 0.5em',
                    display: 'block'
                }}
            >
            {
                children != null &&
                children
            }
            </div>
            <Row
                rowAlign={Align.End}
                style={{
                    gap : '6px',
                }}
            >
            {
                choices?.map((choice, index)=>{
                    const text = typeof choice === 'string' ? choice : choice.text;
                    let choiceTone:ChoiceTone = typeof choice === 'string' ? 'default' : (choice.tone ?? 'default');

                    let tone:string|undefined = undefined;
                    if (choiceTone === 'dimmed') tone = 'transparent';
                    else if (choiceTone === 'highlight') tone = 'highlight';

                    return (
                        <Button
                            key={index}
                            className={
                                classNames(
                                    styles['dialog-button'],
                                    tone,
                                )
                            }
                            style={{ minWidth: '6em' }}
                            onClick={async ()=>{
                                if (await onSelect(text, index)) {
                                    close();
                                }
                            }}
                        >{text}</Button>
                    );
                })
            }
            </Row>
        </Modal>
    )
}

export default ChoiceDialog;
import classNames from 'classnames';

import { Align, Row } from '@/components/layout';
import { Modal, ModalHeader } from '@/components/Modal';
import Button from '@/components/Button';

import useModalDisappear from '@/hooks/useModalDisappear';

import { CommonDialogProps } from './types';
import styles from './styles.module.scss';
import useHotkey from '@/hooks/useHotkey';

type ChoiceTone = 'default'|'highlight'|'dimmed'|'warn';
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



/**
 * 다이얼로그 컴포넌트로, 제목과 내용, 그리고 여러 선택지를 버튼 형태로 표시합니다.
 * @param {ChoiceDialogProps} props - 컴포넌트에 전달할 props입니다.
 * @returns {JSX.Element} 생성된 다이얼로그 JSX 요소입니다.
 */
function ChoiceDialog({
    title,
    children,
    choices,
    onSelect = async (choice:string, index:number)=>true,
    onClose,

    onEnter = async ()=>false,
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

                    return (
                        <Button
                            key={index}
                            className={
                                classNames(
                                    styles['dialog-button'],
                                    choiceTone,
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
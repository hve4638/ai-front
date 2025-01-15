import { useEffect, useState } from "react";
import { MODAL_DISAPPEAR_DURATION } from "data";
import { Modal, ModalBackground, ModalHeader } from "components/Modal";
import { useTranslation } from "react-i18next";
import { Align, Grid, Row } from "components/layout";
import classNames from "classnames";
import { GoogleFontIcon } from "components/GoogleFontIcon";

import styles from './styles.module.scss';
import { PromptTreeDirectory, PromptTreeNode } from "./nodes";
import Button from "components/Button";

type PromptTreeModalProps = {
    onClose: () => void;
}

function PromptTreeModal({
    onClose,
}:PromptTreeModalProps) {
    const { t } = useTranslation();
    const [disappear, setDisappear] = useState(true);
    const [tree, setTree] = useState([
        {
            type: 'directory',
            name: 'Root',
            fixed: true,
            children: [
                {
                    type: 'node',
                    name: 'Prompt 1',
                    fixed: true,
                },
            ]
        },
        {
            type: 'node',
            name: 'New Prompt',
            added : true,
        }
    ]);
    const makeNode = (node:any, key:string|number=0) => {
        if (node.type === 'directory') {
            console.log(node);
            return (
                <PromptTreeDirectory
                    name={node.name}
                    key={key}
                    fixed={node.fixed ?? false}
                    editted={node.editted ?? false}
                    added={node.added ?? false}
                >
                {
                    node.children.map(
                        (child:any, childIndex:number) => makeNode(child, childIndex)
                    )
                }
                </PromptTreeDirectory>
            );
        }
        else {
            return (
                <PromptTreeNode
                    name={node.name}
                    key={key}
                    fixed={node.fixed ?? false}
                    editted={node.editted ?? false}
                    added={node.added ?? false}
                />
            );
        }
    }

    const onExit = () => {
        setDisappear(true);
        setTimeout(() => {
            onClose();
        }, MODAL_DISAPPEAR_DURATION);
    }
    
    useEffect(()=>{
        
    }, []);

    useEffect(()=>{
        setTimeout(()=>setDisappear(false), 1);
    }, []);

    return (
        <Modal
            disappear={disappear}
            style={{
                maxHeight: '80%',
            }}
        >
            <Grid
                columns='1fr'
                rows='64px 1fr 32px'
                style={{
                    height: '100%',
                }}
            >
                <ModalHeader
                    hideCloseButton={true}
                    title={t('prompt.save')}
                />
                <div
                    className={
                        classNames(
                            styles['tree-container'],
                            'undraggable'
                        )
                    }
                    style={{
                        display: 'block',
                        overflow: 'auto',
                        height : '100%',
                    }}
                >
                    {
                        tree.map((node, index) => makeNode(node, index))
                    }
                </div>
                <Row
                    rowAlign={Align.End}
                    style={{
                        height: '100%'
                    }}
                >
                    <Button
                        onClick={onExit}
                        style={{
                            height: '100%'
                        }}
                    >확인</Button>
                    <Button
                        onClick={onExit}
                        style={{
                            height: '100%'
                        }}
                    >취소</Button>
                </Row>
            </Grid>
        </Modal>
    );
}

export default PromptTreeModal;
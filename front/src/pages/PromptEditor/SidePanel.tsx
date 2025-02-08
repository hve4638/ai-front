import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { useTranslation } from "react-i18next";
import styles from './styles.module.scss';

import { calcTextPosition } from 'utils';
import { Align, Column, Flex, Grid, Row } from "components/layout";
import { GoogleFontIcon } from 'components/GoogleFontIcon';
import { TextInput } from 'components/Input';
import Button from 'components/Button';
import { DropdownForm } from 'components/Forms';
import { PromptData } from './types';
import { PromptInputType } from 'types';
import { useModals } from 'hooks/useModals';
import MetadataEditModal from './MetadataEditModal';
import { ProfileContext, useContextForce } from 'context';
import RTSaveModal from './RTSaveModal';
import { mapRTMetadataToNode } from 'utils/rt';
import { RTNodeTree } from 'types/rt-node';
import VarEditModal from './VarEditModal';
import useHotkey from 'hooks/useHotkey';

type SidePanelProps = {
    promptData:PromptData;
    onBack : ()=>void;

    onChangeInputType: (inputType:PromptInputType)=>void;
    onRefresh: ()=>void;
    onAddPromptVarClick: ()=>void;
    onRemovePromptVarClick: (promptVar:PromptVar)=>void;
}

function SidePanel({
    promptData,
    
    onBack,
    onRefresh,
    onChangeInputType,
    onAddPromptVarClick,
    onRemovePromptVarClick,
}:SidePanelProps) {
    const { t } = useTranslation();
    const modals = useModals();
    const profileContext = useContextForce(ProfileContext);
    
    const save = async ()=>{
        const metadataTree = await profileContext.getRTTree();
        const prevRTTree = mapRTMetadataToNode(metadataTree);
        const rtTree = [
            ...prevRTTree,
            {
                type : 'node',
                name : promptData.name,
                id : promptData.id,
                added : true,
                edited : false,
            }
        ] as RTNodeTree;

        modals.open(RTSaveModal, {
            item: rtTree,
            onConfirm : async (tree:RTMetadataTree)=>{
                // if (currentEditMode === PromptEditMode.NEW) {
                //     await saveNewPrompt(tree);
                // }
            },
            onCancel : ()=>{}
        });
    }
    
    useHotkey({
        's' : (e)=>{
            if (e.ctrlKey) {
                save();
                return true;
            }
        }
    }, modals.count === 0, [save]);
    
    return <Column
        className={styles['edit-panel']}
        style={{
            width: '100%',
            height: '100vh',
            overflowY: 'auto',
        }}
    >
        <Row
            style={{
                width: '100%',
                height: '2em',
            }}
            columnAlign={Align.Center}
        >
            <div
                style={{
                    display: 'block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                }}
            >{promptData.name}</div>
            <Flex/>
            <GoogleFontIcon
                enableHoverEffect={true}
                className='noflex'
                style={{
                    fontSize: '1.5em',
                    cursor: 'pointer',
                    margin: '4px'
                }}
                value='edit'
                onClick={()=>{
                    modals.open(MetadataEditModal, {
                        metadata: promptData,
                        onChange: async (next)=>{
                            // id 중복 검사
                            if (promptData.id === next.id || !await profileContext.hasRTId(next.id)) {
                                promptData.name = next.name;
                                promptData.id = next.id;
                                onRefresh();
                                return true;
                            }
                            return false;
                        }
                    });
                    // onEditMetadataClick();
                }}
            />
            <GoogleFontIcon
                enableHoverEffect={true}
                className='noflex'
                style={{
                    fontSize: '1.5em',
                    cursor: 'pointer',
                    margin: '4px'
                }}
                value='close'
                onClick={()=>onBack()}
            />
        </Row>
        <div style={{height: '1em'}}/>
        <h2
            className='undraggable'
            style={{
                marginBottom: '4px'
            }}
        >{'프롬프트'}</h2>
        <DropdownForm
            name='요청 형태'
            value={promptData.inputType}
            items={[
                { name: '일반', key: PromptInputType.NORMAL },
                { name: '채팅', key: PromptInputType.CHAT },
            ]}
            onChange={(select)=>onChangeInputType(select.key as PromptInputType)}
            onItemNotFound={()=>onChangeInputType(PromptInputType.NORMAL)}
        />
        <hr/>
        <h2
            className='undraggable'
            style={{
                marginBottom: '4px'
            }}
        >변수</h2>
        <div
            style={{
                display: 'block',
                width: '100%',
                overflowY: 'auto',
            }}
        >
        {
            promptData.vars.map((item, index)=>(
                <Row
                    className={
                        classNames(
                            'undraggable',
                            'row-button'
                        )
                    }
                    style={{
                        width: '100%',
                        height: '36px',
                        padding: '4px 8px'
                    }}
                    onClick={()=>{
                        modals.open(VarEditModal, {
                            promptVar: item,
                            onRefresh: onRefresh,
                        });
                    }}
                >
                    <span>{item.name}</span>
                    <Flex/>
                    <GoogleFontIcon
                        enableHoverEffect={true}
                        style={{
                            fontSize: '20px',
                            cursor: 'pointer',
                            margin: 'auto 4px',
                            width: '28px',
                            height: '28px',
                        }}
                        value='delete'
                        onClick={(e)=>{
                            e.preventDefault();
                            e.stopPropagation();

                            onRemovePromptVarClick(item);
                        }}
                    />
                </Row>
            ))
        }
        </div>
        <div
            className={classNames(
                'undraggable center',
                styles['add-var-button']
            )}
            onClick={()=>{
                onAddPromptVarClick();
            }}
        >
            <GoogleFontIcon
                value='add_circle'
            />
            <span
                style={{
                    marginLeft: '0.5em',
                }}
            >
                변수 추가
            </span>
        </div>
        <Flex/>
        <Row
            className='noflex'
            style={{
                width: '100%',
                height: '48px',
                padding: '8px 0px'
            }}
        >
            <Button
                className={styles['save-button']}
                style={{
                    width: '100%',
                    height: '100%',
                }}
                onClick={save}
            >
                { t('prompt.save_new') }
            </Button>
        </Row>
    </Column>;
}

export default SidePanel;
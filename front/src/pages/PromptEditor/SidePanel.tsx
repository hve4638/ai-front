import classNames from 'classnames';
import { useTranslation } from "react-i18next";
import styles from './styles.module.scss';

import { useProfileEvent } from '@/stores';
import { RTStoreContext, useContextForce } from '@/context';

import { Align, Column, Flex, Grid, Row } from "@/components/layout";
import { GIconButton, GoogleFontIcon } from '@/components/GoogleFontIcon';
import { DropdownForm } from '@/components/Forms';
import Button from '@/components/Button';

import { useModal } from '@/hooks/useModal';
import useHotkey from '@/hooks/useHotkey';
import MetadataEditModal from './MetadataEditModal';
import VarEditModal from './VarEditModal';

import type { PromptEditorData, PromptInputType } from '@/types';
import { EditableText } from '@/components/EditableText';
import PromptOnlyConfigModal from './PromptOnlyConfigModal';

type SidePanelProps = {
    data:PromptEditorData;
    saved?:boolean;

    onSave: ()=>Promise<void>;
    onBack : ()=>void;
    onRefresh: ()=>void;

    onChangeInputType: (inputType:PromptInputType)=>void;
    onAddPromptVar: ()=>PromptVar;
    onRemovePromptVar: (promptVar:PromptVar)=>void;
}

function SidePanel({
    data,
    saved=false,

    onSave,
    onBack,
    
    onRefresh,
    onChangeInputType,
    onAddPromptVar,
    onRemovePromptVar,
}:SidePanelProps) {
    const { t } = useTranslation();
    const modal = useModal();

    const openVarEditorModal = (promptVar:PromptVar) => {
        modal.open(VarEditModal, {
            variables : data.variables,
            target: promptVar,
            onRefresh: ()=>{
                if (!data.changedVariables.includes(promptVar)) {
                    data.changedVariables.push(promptVar);
                }
                console.log('changed', promptVar);
                onRefresh();
            },
        });
    }
    const openPromptOnlyConfigModal = () => {
        modal.open(PromptOnlyConfigModal, {
            data,
            onRefresh : () => {
                console.log('changed');
                onRefresh();
            },
        });
    }
    
    useHotkey({
        's' : (e)=>{
            if (e.ctrlKey) {
                onSave();
                return true;
            }
        }
    }, modal.count === 0, [onSave]);
    
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
            <EditableText
                value={data.name ?? ''}
                editable={true}
                onChange={(name)=>{
                    data.changed.name = true;
                    data.name = name;
                    onRefresh();
                }}
            />
            {/* <strong
                style={{
                    display: 'block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                }}
            >{data.name}</strong> */}
            <GIconButton
                className='noflex'
                style={{
                    fontSize: '1.5em',
                    cursor: 'pointer',
                    margin: '4px'
                }}
                value='settings'
                onClick={()=>openPromptOnlyConfigModal()}
                hoverEffect='circle'
            />
            <GIconButton
                className='noflex'
                style={{
                    fontSize: '1.5em',
                    cursor: 'pointer',
                    margin: '4px'
                }}
                value='close'
                onClick={()=>onBack()}
                hoverEffect='square'
            />
        </Row>
        <div style={{height: '1em'}}/>
        {/* <h2
            className='undraggable'
            style={{
                marginBottom: '4px'
            }}
        >{'프롬프트'}</h2> */}
        {/* <DropdownForm
            name='요청 형태'
            value={data.inputType}
            items={[
                { name: '일반', key: PromptInputType.NORMAL },
                { name: '채팅', key: PromptInputType.CHAT },
            ]}
            onChange={(select)=>onChangeInputType(select.key as PromptInputType)}
            onItemNotFound={()=>onChangeInputType(PromptInputType.NORMAL)}
        /> */}
        {/* <hr/> */}
        <h2
            className='undraggable'
            style={{
                marginBottom: '4px'
            }}
        >{'변수'}</h2>
        <div
            style={{
                display: 'block',
                width: '100%',
                overflowY: 'auto',
            }}
        >
        {
            data.variables.map((item, index)=>(
                <Row
                    key={index}
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
                        openVarEditorModal(item);
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

                            onRemovePromptVar(item);
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
                const promptVar = onAddPromptVar();
                openVarEditorModal(promptVar);
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
                {t('prompt_editor.add_form_label')}
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
                disabled={saved}
                className={styles['save-button']}
                style={{
                    width: '100%',
                    height: '100%',
                }}
                onClick={onSave}
            >
            {
                saved
                ? t('prompt_editor.saved_label')
                : t('prompt_editor.save_label')
            }
            </Button>
        </Row>
    </Column>
}

export default SidePanel;
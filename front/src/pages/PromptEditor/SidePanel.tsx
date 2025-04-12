import classNames from 'classnames';
import { useTranslation } from "react-i18next";
import styles from './styles.module.scss';

import { Align, Column, Flex, Grid, Row } from "components/layout";
import { GoogleFontIcon } from 'components/GoogleFontIcon';
import Button from 'components/Button';
import { DropdownForm } from 'components/Forms';
import { PromptData } from '@/types';
import { PromptInputType } from 'types';
import { useModal } from 'hooks/useModal';
import MetadataEditModal from './MetadataEditModal';
import VarEditModal from './VarEditModal';
import useHotkey from 'hooks/useHotkey';
import { useProfileEvent } from '@/stores';
import { RTStoreContext, useContextForce } from '@/context';

type SidePanelProps = {
    promptData:PromptData;
    onSave: (tree:RTMetadataTree)=>Promise<void>;
    onBack : ()=>void;

    onChangeInputType: (inputType:PromptInputType)=>void;
    onRefresh: ()=>void;
    onAddPromptVarClick: ()=>PromptVar;
    onRemovePromptVarClick: (promptVar:PromptVar)=>void;
}

function SidePanel({
    promptData,

    onSave,
    onBack,
    
    onRefresh,
    onChangeInputType,
    onAddPromptVarClick,
    onRemovePromptVarClick,
}:SidePanelProps) {
    const { t } = useTranslation();
    const modal = useModal();
    const { hasRTId } = useProfileEvent();
    const rtState = useContextForce(RTStoreContext);
    
    const save = async ()=>{
        rtState.update.promptdata('default', {
            name : promptData.name,
            id : promptData.id,
            forms : promptData.forms,
            inputType : promptData.inputType,
            contents : promptData.contents,
        })
    }
    
    useHotkey({
        's' : (e)=>{
            if (e.ctrlKey) {
                save();
                return true;
            }
        }
    }, modal.count === 0, [save]);
    
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
            <strong
                style={{
                    display: 'block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                }}
            >{promptData.name}</strong>
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
                    modal.open(MetadataEditModal, {
                        metadata: promptData,
                        onChange: async (next)=>{
                            // id 중복 검사
                            if (promptData.id === next.id || !await hasRTId(next.id)) {
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
        >{'변수'}</h2>
        <div
            style={{
                display: 'block',
                width: '100%',
                overflowY: 'auto',
            }}
        >
        {
            promptData.forms.map((item, index)=>(
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
                        modal.open(VarEditModal, {
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
                const promptVar = onAddPromptVarClick();
                modal.open(VarEditModal, {
                    promptVar: promptVar,
                    onRefresh: onRefresh,
                });
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
                className={styles['save-button']}
                style={{
                    width: '100%',
                    height: '100%',
                }}
                onClick={save}
            >
                { t('prompt_editor.save_label') }
            </Button>
        </Row>
    </Column>
}

export default SidePanel;
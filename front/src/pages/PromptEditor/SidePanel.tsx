import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { useTranslation } from "react-i18next";
import styles from './styles.module.scss';

import { PromptVar, PromptVarType } from 'types/prompt-variables';
import { calcTextPosition } from 'utils';
import { Align, Column, Flex, Grid, Row } from "components/layout";
import { GoogleFontIcon } from 'components/GoogleFontIcon';
import { TextInput } from 'components/Input';
import Button from 'components/Button';
import { DropdownForm } from 'components/Forms';
import { PromptData } from './types';
import { PromptInputType } from 'types';

type SidePanelProps = {
    promptData:PromptData;
    onChangeInputType: (inputType:PromptInputType)=>void;
    onRefresh: ()=>void;
    onSaveClick: ()=>void;
    onCancelClick: ()=>void;
    onEditMetadataClick: ()=>void;
    onAddPromptVarClick: ()=>void;
    onEditPromptVarClick: (promptVar:PromptVar)=>void;
    onRemovePromptVarClick: (promptVar:PromptVar)=>void;
}

function SidePanel({
    promptData,
    
    onRefresh,
    onChangeInputType,
    onSaveClick,
    onCancelClick,
    onEditMetadataClick,
    onAddPromptVarClick,
    onEditPromptVarClick,
    onRemovePromptVarClick,
}:SidePanelProps) {
    const { t } = useTranslation();
    
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
                onClick={()=>onEditMetadataClick()}
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
                onClick={()=>onCancelClick()}
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
                    onClick={()=>onEditPromptVarClick(item)}
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
                onClick={()=>onSaveClick()}
            >
                { t('prompt.save_new') }
            </Button>
        </Row>
    </Column>;
}

export default SidePanel;
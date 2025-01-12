import classNames from 'classnames';
import { CheckBoxForm, DropdownForm, NumberForm, StringForm, StringLongForm } from 'components/Forms';
import { GoogleFontIcon } from 'components/GoogleFontIcon';
import { TextInput } from 'components/Input';
import { Align, Flex, Grid, Row } from 'components/layout';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { PromptVarSelect, PromptVarSelectOption } from 'types/prompt-variables';


type PropmtVarSelectOptionProps = {
    promptVar:PromptVarSelect;
    onRefresh:()=>void;
}

function PropmtVarSelectOption({
    promptVar,
    onRefresh
}:PropmtVarSelectOptionProps) {
    const options = (promptVar.options ?? []).map((option)=>({
        name: option.name,
        key: option.value
    }));

    useLayoutEffect(()=>{
        if (!promptVar.options) {
            promptVar.options = [
                {
                    name: '선택 1',
                    value: 'select-1',
                }
            ];
            onRefresh();
        }
    }, [promptVar]);

    return (
    <>
        <hr/>
        <DropdownForm
            name='기본값'
            items={options}
            value={promptVar.default_value}
            onChange={(item)=>{
                promptVar.default_value = item.key;
                onRefresh();
            }}
            onItemNotFound={()=>{
                if (options.length > 0) {
                    promptVar.default_value = options[0].key;
                    onRefresh();
                }
            }}
        />
        <hr/>
        <Row
            className='undraggable'
            rowAlign={Align.SpaceBetween}
            style={{
                width: '100%',
                height: '32px',
            }}
        >
            <h2>옵션</h2>
            <GoogleFontIcon
                enableHoverEffect={true}
                value='add'
                style={{
                    width: '32px',
                    height: '32px',
                    cursor: 'pointer',
                    fontSize: '24px'
                }}
                onClick={()=>{
                    const prev = promptVar.options ?? [];

                    promptVar.options = [
                        ...prev,
                        {
                            name: '',
                            value: '',
                        }
                    ];
                    onRefresh();
                }}
            />
        </Row>
        <div
            style={{
                display: 'block',
                overflowY: 'auto',
            }}
        >
        {
            promptVar.options != null &&
            promptVar.options.map((option, index)=>(
                <SelectOption
                    key={index}
                    option={option}
                    onRefresh={()=>onRefresh()}
                    onDelete={(option)=>{
                        const prev = promptVar.options ?? [];
                        const next = prev.filter((item)=>item !== option)

                        promptVar.options = next;
                        onRefresh();
                    }}
                />
            ))
        }
        </div>
    </>
    );
}

type SelectOptionProps = {
    option:PromptVarSelectOption;
    onRefresh:()=>void;
    onDelete:(option:PromptVarSelectOption)=>void;
}

function SelectOption({
    option,
    onRefresh,
    onDelete,
}:SelectOptionProps) {
    return (
        <Grid
            columns='16px 3em 128px 2.5em 128px 4px 32px'
            rows='100%'
            style={{
                width: '100%',
                height: '32px',
                fontSize: '16px',
            }}
        >
            <span/>
            <span className='center undraggable'>이름</span>
            <TextInput
                value={option.name}
                onChange={(name)=>{
                    option.name = name;
                    onRefresh();
                }}
                style={{
                    width: '100%',
                    height: '90%',
                    padding: '0px 6px',
                    margin: 'auto'
                }}
            />
            <span className='center undraggable'>키</span>
            <TextInput
                value={option.value}
                onChange={(value)=>{
                    option.value = value;
                    onRefresh();
                }}
                style={{
                    width: '100%',
                    height: '90%',
                    padding: '0px 6px',
                    margin: 'auto'
                }}
            />
            <div/>
            <GoogleFontIcon
                enableHoverEffect={true}
                value='delete'
                style={{
                    width: '32px',
                    height: '32px',
                    cursor: 'pointer',
                    fontSize: '18px'
                }}
                onClick={()=>{
                    onDelete(option);
                }}
            />
        </Grid>
    )
}

export default PropmtVarSelectOption;
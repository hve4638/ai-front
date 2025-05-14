import classNames from 'classnames';
import { DropdownForm } from 'components/Forms';
import { GoogleFontIcon } from 'components/GoogleFontIcon';
import { TextInput } from 'components/Input';
import { Align, Flex, Grid, Row } from 'components/layout';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

type PropmtVarSelectOptionProps = {
    promptVar:PromptVarSelect;
    onRefresh:()=>void;
}

function PropmtVarSelectOption({
    promptVar,
    onRefresh
}:PropmtVarSelectOptionProps) {
    const { t } = useTranslation();
    
    const options = (promptVar.options ?? []).map((option)=>({
        name: option.name,
        key: option.value
    }));

    useLayoutEffect(()=>{
        if (!promptVar.options) {
            promptVar.options = [];
            addOption();
        }
    }, [promptVar]);

    const addOption = () => {
        const makeAlphabetIndex = (num:number) => {
            const alphabet = 'abcdefghijklmnopqrstuvwxyz';

            if (num < 0) return '';
            if (num <= 26) return alphabet[num];

            let n = num - 1;
            let label = '';
            while (n >= 0) {
                label = alphabet[n % 26] + label;
                n = Math.floor(n / 26) - 1;
            }
            return label;
        }
        promptVar.options ??= [];
        const num = promptVar.options.length + 1;

        const name = `선택 ${num}`;
        let baseValue = `select-${num}`;
        let value:string;
        let index = -1;

        do {
            value = baseValue + makeAlphabetIndex(index);
            index++;
        } while (promptVar.options.find((item)=>item.value === value) != undefined);

        promptVar.options.push({ name, value });
        onRefresh();
    }

    return (
    <>
        <hr/>
        <DropdownForm
            name={t('form_editor.default_value_label')}
            items={options}
            value={promptVar.default_value ?? ''}
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
            <div>{t('form_editor.select_config.option_label')}</div>
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
                    addOption();
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
                    onChangeName={(name)=>{
                        option.name = name;
                        onRefresh();
                    }}
                    onChangeValue={(value)=>{
                        const filtered = (promptVar.options ?? []).filter((item)=>item.value === value);
                        if (
                            filtered.length === 0
                            || (filtered.length === 1 && filtered[0] === option)
                        ) {
                            option.value = value;
                            onRefresh();
                        }
                    }}  
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

/// @TODO : 원래 타입 정의 어디감??
type PromptVarSelectOption = { name: string; value: string; };

type SelectOptionProps = {
    option:PromptVarSelectOption;
    onChangeName:(name:string)=>void;
    onChangeValue:(value:string)=>void;
    onRefresh:()=>void;
    onDelete:(option:PromptVarSelectOption)=>void;
}

function SelectOption({
    option,
    onChangeName,
    onChangeValue,
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
                onChange={onChangeName}
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
                onChange={onChangeValue}
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
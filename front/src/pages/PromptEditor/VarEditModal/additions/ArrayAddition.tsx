import classNames from 'classnames';
import styles from '../../styles.module.scss'
import { CheckBoxForm, DropdownForm, NumberForm, StringForm, StringLongForm } from 'components/Forms';
import { GoogleFontIcon } from 'components/GoogleFontIcon';
import { dropdownItem } from '../utils';
import { useEffect } from 'react';
import TextAddition from './TextAddition';
import CheckboxAddition from './CheckboxAddition';
import NumberAddition from './NumberAddition';
import SelectAddition from './SelectAddition';
import StructAddition from './StructAddition';

const VAR_DROPDOWN_ITEMS = [
    dropdownItem('텍스트', 'text'),
    dropdownItem('숫자', 'number'),
    dropdownItem('체크박스', 'checkbox'),
    dropdownItem('목록', 'select'),
    dropdownItem('구조체', 'struct'),
]

type ArrayAdditionProps = {
    promptVar:PromptVarArray;
    fieldVarRef:React.MutableRefObject<PromptVar|null>|null;
    onRefresh:()=>void;
}

function ArrayAddition({
    promptVar,
    fieldVarRef,
    onRefresh
}:ArrayAdditionProps) {
    useEffect(()=>{
        if ('element' in promptVar) {
            promptVar.element = {} as any;
            onRefresh();
        }
    }, [promptVar]);

    return (
    <>
        <hr/>
        <DropdownForm
            name='원소 타입'
            items={VAR_DROPDOWN_ITEMS}
            value={promptVar.element?.type}
            onChange={(item)=>{
                if (!promptVar.element) {
                    promptVar.element = {} as any;
                }
                promptVar.element.type = item.key as PromptVarType;
                onRefresh();
            }}
            onItemNotFound={()=>{
                if (!promptVar.element) {
                    promptVar.element = {} as any;
                }
                promptVar.element.type = VAR_DROPDOWN_ITEMS[0].key as PromptVarType;
                onRefresh();
            }}
        />
        {
            promptVar.element?.type === 'text' &&
            <TextAddition
                promptVar={promptVar.element}
                onRefresh={onRefresh}
            />
        }
        {
            promptVar.element?.type === 'checkbox' &&
            <CheckboxAddition
                promptVar={promptVar.element}
                onRefresh={onRefresh}
            />
        }
        {
            promptVar.element?.type === 'number' &&
            <NumberAddition
                promptVar={promptVar.element}
                onRefresh={onRefresh}
            />
        }
        {
            promptVar.element?.type === 'select' &&
            <SelectAddition
                promptVar={promptVar.element}
                onRefresh={onRefresh}
            />
        }
        {
            promptVar.element?.type === 'struct' &&
            <StructAddition
                promptVar={promptVar.element}
                fieldVarRef={fieldVarRef}
                onRefresh={onRefresh}
            />
        }
    </>
    );
}

export default ArrayAddition;
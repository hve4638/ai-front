import { CheckBoxForm, NumberForm } from '@/components/Forms';
import { useEffect } from 'react';

type PropmtVarNumberOptionProps = {
    promptVar:PromptVarNumber;
    onRefresh:()=>void;
}

function PropmtVarNumberOption({
    promptVar,
    onRefresh
}:PropmtVarNumberOptionProps) {
    return (
    <>
        <hr/>
        <CheckBoxForm
            name='소수점 허용'
            checked={promptVar.allow_decimal ?? false}
            onChange={(checked)=>{
                promptVar.allow_decimal = checked;
                onRefresh();
            }}
        />
        <NumberForm
            name='기본값'
            value={promptVar.default_value ?? -1}
            onChange={(value)=>{
                promptVar.default_value = isNaN(value) ? 0 : value;
                onRefresh();
            }}
            allowDecimal={promptVar.allow_decimal ?? false}
            
            width='10em'
        />
    </>
    );
}

export default PropmtVarNumberOption;
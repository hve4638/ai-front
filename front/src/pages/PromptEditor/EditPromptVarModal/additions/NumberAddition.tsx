import { CheckBoxForm, NumberForm, StringForm, StringLongForm } from "components/Forms";
import { PromptVarNumber } from "types/prompt-variables";

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
            value={promptVar.default_value ?? 0}
            onChange={(value)=>{
                promptVar.default_value = value;
                onRefresh();
            }}
            allowDecimal={promptVar.allow_decimal ?? false}
        />
    </>
    );
}

export default PropmtVarNumberOption;
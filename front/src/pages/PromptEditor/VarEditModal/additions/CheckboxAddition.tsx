import { CheckBoxForm, NumberForm, StringForm, StringLongForm } from "components/Forms";

type PropmtVarCheckboxOptionProps = {
    promptVar:PromptVarCheckbox;
    onRefresh:()=>void;
}

function PropmtVarCheckboxOption({
    promptVar,
    onRefresh
}:PropmtVarCheckboxOptionProps) {
    return (
    <>
        <hr/>
        <CheckBoxForm
            name='기본값'
            checked={promptVar.default_value ?? false}
            onChange={(checked)=>{
                promptVar.default_value = checked;
                onRefresh();
            }}
        />
    </>
    );
}

export default PropmtVarCheckboxOption;
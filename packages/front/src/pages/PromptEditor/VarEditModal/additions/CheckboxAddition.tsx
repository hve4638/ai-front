import { CheckBoxForm } from '@/components/Forms';
import { useTranslation } from 'react-i18next';

type PropmtVarCheckboxOptionProps = {
    promptVar:PromptVarCheckbox;
    onRefresh:()=>void;
}

function PropmtVarCheckboxOption({
    promptVar,
    onRefresh
}:PropmtVarCheckboxOptionProps) {
    const { t } = useTranslation();

    return (
    <>
        <hr/>
        <CheckBoxForm
            name={t('form_editor.default_value_label')}
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
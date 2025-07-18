import { useTranslation } from 'react-i18next';
import { CheckBoxForm, StringForm, StringLongForm } from '@/components/Forms';
import InputField from '@/components/InputField';
import { TextAreaInput } from '@/components/Input';

type PropmtVarTextOptionProps = {
    promptVar:PromptVarText;
    onRefresh:()=>void;
}

function PropmtVarTextOption({
    promptVar,
    onRefresh
}:PropmtVarTextOptionProps) {
    const { t } = useTranslation();

    return (
    <>
        <hr/>
        <CheckBoxForm
            name={t('form_editor.text_config.allow_multiline_label')}
            checked={promptVar.allow_multiline ?? false}
            onChange={(checked)=>{
                promptVar.allow_multiline = checked;
                onRefresh();
            }}
        />
        <StringForm
                name={t('form_editor.text_config.placeholder_label')}
                value={promptVar.placeholder ?? ''}
                onChange={(value)=>{
                    promptVar.placeholder = value;
                    onRefresh();
                }}
                width='10em'
            />
        {
            promptVar.allow_multiline
            ? <>
                <div
                    style={{
                        marginBottom: '0.25em',
                    }}
                >{t('form_editor.default_value_label')}</div>
                <TextAreaInput
                    value={promptVar.default_value ?? ''}
                    onChange={(value)=>{
                        promptVar.default_value = value;
                        onRefresh();
                    }}
                >
                    
                </TextAreaInput>
            </>
            : <StringForm
                name={t('form_editor.default_value_label')}
                value={promptVar.default_value ?? ''}
                onChange={(value)=>{
                    promptVar.default_value = value;
                    onRefresh();
                }}
                width='10em'
            />
        }
    </>
    );
}

export default PropmtVarTextOption;
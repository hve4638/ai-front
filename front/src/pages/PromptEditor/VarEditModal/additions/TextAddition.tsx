import { CheckBoxForm, StringForm, StringLongForm } from "components/Forms";

type PropmtVarTextOptionProps = {
    promptVar:PromptVarText;
    onRefresh:()=>void;
}

function PropmtVarTextOption({
    promptVar,
    onRefresh
}:PropmtVarTextOptionProps) {
    return (
    <>
        <hr/>
        <CheckBoxForm
            name='여러 줄 허용'
            checked={promptVar.allow_multiline ?? false}
            onChange={(checked)=>{
                promptVar.allow_multiline = checked;
                onRefresh();
            }}
        />
        {
            promptVar.allow_multiline ?
            <StringLongForm
                name='기본값'
                value={promptVar.default_value ?? ''}
                onChange={(value)=>{
                    promptVar.default_value = value;
                    onRefresh();
                }}
            /> :
            <StringForm
                name='기본값'
                value={promptVar.default_value ?? ''}
                onChange={(value)=>{
                    promptVar.default_value = value;
                    onRefresh();
                }}
            />
        }
        {
            promptVar.allow_multiline ?
            <StringLongForm
                name='플레이스홀더'
                value={promptVar.placeholder ?? ''}
                onChange={(value)=>{
                    promptVar.placeholder = value;
                    onRefresh();
                }}
            /> :
            <StringForm
                name='플레이스홀더'
                value={promptVar.placeholder ?? ''}
                onChange={(value)=>{
                    promptVar.placeholder = value;
                    onRefresh();
                }}
            />
        }
    </>
    );
}

export default PropmtVarTextOption;
import TextAddition from './TextAddition';
import NumberAddition from './NumberAddition';
import CheckboxAddition from './CheckboxAddition';
import SelectAddition from './SelectAddition';
import StructAddition from './StructAddition';
import ArrayAddition from './ArrayAddition';
import { PromptVar, PromptVarType } from 'types/prompt-variables';

type AdditionsProps = {
    promptVar:PromptVar;
    fieldVarRef:React.MutableRefObject<PromptVar|null>|null;
    onRefresh:()=>void;
}

function Additions({
    promptVar,
    fieldVarRef,
    onRefresh
}:AdditionsProps) {
    return (
    <>
        {
            promptVar.type === PromptVarType.Text &&
            <TextAddition
                promptVar={promptVar}
                onRefresh={onRefresh}
            />
        }
        {
            promptVar.type === PromptVarType.Number &&
            <NumberAddition
                promptVar={promptVar}
                onRefresh={onRefresh}
            />
        }
        {
            promptVar.type === PromptVarType.Checkbox &&
            <CheckboxAddition
                promptVar={promptVar}
                onRefresh={onRefresh}
            />
        }
        {
            promptVar.type === PromptVarType.Select &&
            <SelectAddition
                promptVar={promptVar}
                onRefresh={onRefresh}
            />
        }
        {
            promptVar.type === PromptVarType.Array &&
            <ArrayAddition
                promptVar={promptVar}
                fieldVarRef={fieldVarRef}
                onRefresh={onRefresh}
            />
        }
        {
            promptVar.type === PromptVarType.Struct &&
            <StructAddition
                promptVar={promptVar}
                fieldVarRef={fieldVarRef}
                onRefresh={onRefresh}
            />
        }
    </>
    )
}

export default Additions;
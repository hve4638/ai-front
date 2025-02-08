import TextAddition from './TextAddition';
import NumberAddition from './NumberAddition';
import CheckboxAddition from './CheckboxAddition';
import SelectAddition from './SelectAddition';
import StructAddition from './StructAddition';
import ArrayAddition from './ArrayAddition';

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
            promptVar.type === 'text' &&
            <TextAddition
                promptVar={promptVar}
                onRefresh={onRefresh}
            />
        }
        {
            promptVar.type === 'number' &&
            <NumberAddition
                promptVar={promptVar}
                onRefresh={onRefresh}
            />
        }
        {
            promptVar.type === 'checkbox' &&
            <CheckboxAddition
                promptVar={promptVar}
                onRefresh={onRefresh}
            />
        }
        {
            promptVar.type === 'select' &&
            <SelectAddition
                promptVar={promptVar}
                onRefresh={onRefresh}
            />
        }
        {
            promptVar.type === 'array' &&
            <ArrayAddition
                promptVar={promptVar}
                fieldVarRef={fieldVarRef}
                onRefresh={onRefresh}
            />
        }
        {
            promptVar.type === 'struct' &&
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
import TextAddition from './TextAddition';
import NumberAddition from './NumberAddition';
import CheckboxAddition from './CheckboxAddition';
import SelectAddition from './SelectAddition';
import StructAddition from './StructAddition';
import ArrayAddition from './ArrayAddition';

type AdditionsProps = {
    target:PromptVar;
    fieldVarRef:React.MutableRefObject<PromptVar|null>|null;
    onRefresh:()=>void;
}

function Additions({
    target,
    fieldVarRef,
    onRefresh
}:AdditionsProps) {
    return (
    <>
        {
            target.type === 'text' &&
            <TextAddition
                promptVar={target}
                onRefresh={onRefresh}
            />
        }
        {
            target.type === 'number' &&
            <NumberAddition
                promptVar={target}
                onRefresh={onRefresh}
            />
        }
        {
            target.type === 'checkbox' &&
            <CheckboxAddition
                promptVar={target}
                onRefresh={onRefresh}
            />
        }
        {
            target.type === 'select' &&
            <SelectAddition
                promptVar={target}
                onRefresh={onRefresh}
            />
        }
        {
            target.type === 'array' &&
            <ArrayAddition
                promptVar={target}
                fieldVarRef={fieldVarRef}
                onRefresh={onRefresh}
            />
        }
        {
            target.type === 'struct' &&
            <StructAddition
                promptVar={target}
                fieldVarRef={fieldVarRef}
                onRefresh={onRefresh}
            />
        }
    </>
    )
}

export default Additions;
import useDebouncing from "hooks/useDebouncing";
import { VarEditorsProps } from "./types";
import { PROMPT_VAR_TYPE, StructVarMetadata } from "features/prompts";
import { NestedVarEditors } from "./varEditors";

type StructVarEditorProps = VarEditorsProps & {
    item : StructVarMetadata;
};

export function StructVarEditor(props:StructVarEditorProps) {
    const { 
        name, item, value, onChange,
        className='', style={}
    } = props;
    const [input, setInput] = useDebouncing(value, (x)=>onChange(x), 100);

    return (
        <div
            className={'vareditor column ' + className}
            style={style}
        >
            {
                name != null &&
                <div className='bold' style={{marginBottom: '8px'}}>{name}</div>
            }
            <div className="column" style={{paddingLeft: "12px", fontSize:"0.95em"}}>
            {
                item.fields.map((field, index)=>
                    <NestedVarEditors
                        key={index}
                        name={field.display_name}
                        item={field}
                        value={input[field.name]}
                        onChange={(x)=>setInput({...input, [field.name]: x})}
                    />
                )
            }
            </div>
        </div>
    );
}
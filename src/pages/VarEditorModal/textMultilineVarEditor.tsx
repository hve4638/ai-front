import useDebouncing from "hooks/useDebouncing";
import { VarEditorsProps } from "./types";

export function TextMultilineVarEditor(props:VarEditorsProps) {
    const { 
        name, item, value, onChange,
        className='', style={}
    } = props;
    const [input, setInput] = useDebouncing(value, (x)=>onChange(x), 100);

    return (
        <div className='vareditor column'>
            {
                name != null &&
                <div className='bold' style={{marginBottom: "8px"}}>{name}</div>
            }
            <textarea
                spellCheck={false}
                className='scrollbar fontstyle'
                style={{
                    height: '100px'
                }}
                value={input}
                onChange={(e)=>setInput(e.target.value)}
            />
        </div>
    );
}

export function NestedTextMultilineVarEditor(props:VarEditorsProps) {
    const { 
        name, item, value, onChange,
        className='', style={}
    } = props;
    const [input, setInput] = useDebouncing(value, (x)=>onChange(x), 100);

    return (
        <div
            className={'vareditor nested column ' + className}
            style={style}
        >
            {
                name != null &&
                <div className='bold' style={{marginBottom: '8px'}}>{name}</div>
            }
            <textarea
                spellCheck={false}
                className='scrollbar fontstyle'
                style={{
                    height: '100px',
                }}
                value={input}
                onChange={(e)=>setInput(e.target.value)}
            />
        </div>
    );
}
import useDebouncing from "hooks/useDebouncing";
import { VarEditorsProps } from "./types";

export function TextVarEditor(props:VarEditorsProps) {
    const { 
        name, item, value, onChange,
        className='', style={}
    } = props;
    const [input, setInput] = useDebouncing(value, (x)=>onChange(x), 100);

    return (
        <div className='vareditor column'>
            {
                name != null &&
                <div className='bold' style={{marginBottom: '8px'}}>{name}</div>
            }
            <input
                type="text"
                style={{height:"5px"}}
                value={input}
                onChange={(e)=>setInput(e.target.value)}
            />
        </div>
    );
}

export function NestedTextVarEditor(props:VarEditorsProps) {
    const { 
        name, item, value, onChange,
        className='', style={}
    } = props;
    const [input, setInput] = useDebouncing(value, (x)=>onChange(x), 100);

    return (
        <div className={'vareditor nested column ' + className}>
            {
                name != null &&
                <div className='bold' style={{marginBottom: '8px'}}>{name}</div>
            }
            <input
                type="text"
                style={{height:"5px"}}
                value={input}
                onChange={(e)=>setInput(e.target.value)}
            />
        </div>
    );
}
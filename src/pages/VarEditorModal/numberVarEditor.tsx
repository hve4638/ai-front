import useDebouncing from "hooks/useDebouncing";
import { VarEditorsProps } from "./types";

export function NumberVarEditor(props:VarEditorsProps) {
    const { 
        name, item, value, onChange,
        className='', style={}
    } = props;
    const [input, setInput] = useDebouncing(value, (x)=>onChange(x), 100);

    return (
        <div
            className='vareditor row main-spacebetween'
            style={{alignItems : "center"}}
        >
            {
                name != null &&
                <div className='bold'>{name}</div>
            }
            <input
                type="number"
                style={{
                    width : "100px",
                    height : "5px"
                }}
                value={input}
                onChange={(e)=>setInput(e.target.value)}
            />
        </div>
    );
}

export function NestedNumberVarEditor(props:VarEditorsProps) {
    const { 
        name, item, value, onChange,
        className='', style={}
    } = props;
    const [input, setInput] = useDebouncing(value, (x)=>onChange(x), 100);

    return (
        <div
            className={'vareditor nested row ' + className}
        >
            {
                name != null &&
                <div className='bold'>{name}</div>
            }
            <div className="flex"/>
            <input
                className="noflex"
                type="number"
                style={{ width : "100px", height:"5px"}}
                value={input}
                onChange={(e)=>setInput(e.target.value)}
            />
        </div>
    );
}
import { VarEditorsProps } from "./types";
import Checkbox from "components/Checkbox";

export function BooleanVarEditor(props:VarEditorsProps) {
    const { 
        name, item, value, onChange,
        className='', style={}
    } = props;
    return (
        <div
            className={'vareditor row main-spacebetween ' + className}
            style={style}
        >
            {
                name != null &&
                <div className='bold' style={{marginBottom: '8px'}}>{name}</div>
            }
            <Checkbox
                checked={value}
                onChange={(value)=>onChange(value)}
                style={{width: "22px", height: "22px"}}
            />
        </div>
    );
}

export function NestedBooleanVarEditor(props:VarEditorsProps) {
    const { 
        name, item, value, onChange,
        className='', style={}
    } = props;
    return (
        <div
            className={'vareditor nested row ' + className}
            style={style}
        >
            {
                name != null &&
                <div className='bold'>{item.display_name}</div>
            }
            <div className="flex"/>
            <Checkbox
                checked={value}
                onChange={(value)=>onChange(value)}
                style={{width: "22px", height: "22px"}}
            />
        </div>
    );
}
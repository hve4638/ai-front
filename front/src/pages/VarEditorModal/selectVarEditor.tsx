import useDebouncing from "hooks/useDebouncing";
import { VarEditorsProps } from "./types";
import Dropdown from "components/Dropdown";
import { SelectVarMetadata } from "features/prompts";

export type SelectVarEditorProps = VarEditorsProps & {
    item: SelectVarMetadata;
}

export function SelectVarEditor(props:SelectVarEditorProps) {
    const { 
        name, item, value, onChange,
        className='', style={}
    } = props;

    return (
        <div className='vareditor row main-spacebetween'>
            {
                name != null &&
                <div className="bold center">{name}</div>
            }
            
            <Dropdown
                items={item.options ?? []}
                value={value}
                onChange={(value)=>onChange(value)}
                titleMapper={dropdownValueFinder}
            />
        </div>
    );
}

export function NestedSelectVarEditor(props:SelectVarEditorProps) {
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
                <div className='bold center'>{name}</div>
            }
            <div className="flex"/>
            <Dropdown
                items={item.options ?? []}
                value={value}
                onChange={(value)=>onChange(value)}
                titleMapper={dropdownValueFinder}
            />
        </div>
    );
}

const dropdownValueFinder = (value, items) => {
    for (const item of items) {
        if (value == item.value) {
            return item.name;
        }
    }
}
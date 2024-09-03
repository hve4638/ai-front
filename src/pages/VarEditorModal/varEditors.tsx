import { PROMPT_VAR_TYPE, VarMetadata } from "features/prompts";
import { NestedSelectVarEditor, SelectVarEditor } from "./selectVarEditor";
import { NestedTextVarEditor, TextVarEditor } from "./textVarEditor";
import { NestedTextMultilineVarEditor, TextMultilineVarEditor } from "./textMultilineVarEditor";
import { ArrayVarEditor } from "./arrayVarEditor";
import { NestedNumberVarEditor, NumberVarEditor } from "./numberVarEditor";
import { BooleanVarEditor, NestedBooleanVarEditor } from "./booleanVarEditor";
import { StructVarEditor } from "./structVarEditor";
import { NotImplementedError } from "features/errors";
import { VarEditorsProps } from "./types";

export function VarEditors({ name, item, value, onChange }: VarEditorsProps) {
    name ??= item.display_name;

    switch (item.type) {
        case PROMPT_VAR_TYPE.SELECT:
            return <SelectVarEditor name={name} item={item} value={value} onChange={onChange} />
        case PROMPT_VAR_TYPE.TEXT:
            return <TextVarEditor name={name} item={item} value={value} onChange={onChange} />;
        case PROMPT_VAR_TYPE.TEXT_MULTILINE:
            return <TextMultilineVarEditor name={name} item={item} value={value} onChange={onChange} />;
        case PROMPT_VAR_TYPE.ARRAY:
            return (
                <ArrayVarEditor
                    name={name}
                    item={item}
                    value={value}
                    onChange={onChange}
                />
            )
        case PROMPT_VAR_TYPE.NUMBER:
            return <NumberVarEditor name={name} item={item} value={value} onChange={onChange} />;
        case PROMPT_VAR_TYPE.BOOLEAN:
            return <BooleanVarEditor name={name} item={item} value={value} onChange={onChange} />;
        case PROMPT_VAR_TYPE.STRUCT:
            return <StructVarEditor name={name} item={item} value={value} onChange={onChange} />;
        //case PROMPT_VAR_TYPE.IMAGE:
        default:
            throw new NotImplementedError();
    }
}

export function NestedVarEditors(props: VarEditorsProps) {
    const {
        name, item, value, onChange,
        className, style
    } = props;

    switch (item.type) {
        case PROMPT_VAR_TYPE.SELECT:
            return <NestedSelectVarEditor
                className={className}
                style={style}
                name={item.display_name}
                item={item as any}
                value={value}
                onChange={onChange}
            />
        case PROMPT_VAR_TYPE.NUMBER:
            return <NestedNumberVarEditor
                className={className}
                style={style}
                name={name}
                item={item}
                value={value}
                onChange={onChange}
            />
        case PROMPT_VAR_TYPE.TEXT:
            return <NestedTextVarEditor
                className={className}
                style={style}
                name={name}
                item={item}
                value={value}
                onChange={onChange}
            />
        case PROMPT_VAR_TYPE.TEXT_MULTILINE:
            return <NestedTextMultilineVarEditor
                className={className}
                style={style}
                name={name}
                item={item}
                value={value}
                onChange={onChange}
            />
            case PROMPT_VAR_TYPE.BOOLEAN:
                return <NestedBooleanVarEditor
                    className={className}
                    style={style}
                    name={name}
                    item={item}
                    value={value}
                    onChange={onChange}
                />
            case PROMPT_VAR_TYPE.STRUCT:
                return <StructVarEditor
                    className={className}
                    style={style}
                    name={name}
                    item={item}
                    value={value}
                    onChange={onChange}
                />
        default:
            return <></>
    }
}
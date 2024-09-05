import { GoogleFontIconButton } from "components/GoogleFontIcon";
import useDebouncing from "hooks/useDebouncing";
import { NestedVarEditors } from "./varEditors";
import { VarEditorsProps } from "./types";
import { ArrayVarMetadata } from "features/prompts";
import { useEffect } from "react";

type ArrayVarEditorProps = VarEditorsProps & {
    item : ArrayVarMetadata;
}

export function ArrayVarEditor(props:ArrayVarEditorProps) {
    const { 
        name, item, value, onChange,
        className='', style={}
    } = props;
    const elements = value ?? [];
    const onAdd = () => {
        onChange([...elements, item.element.default_value]);
    }
    const onDelete = (index) => {
        const newElements = [...elements];
        newElements.splice(index, 1);

        onChange(newElements);
    }
    const onEdit = (index, value) => {
        const newElements = [...elements];
        newElements[index] = value;
        
        onChange(newElements);
    }
    return (
        <div
            className={'vareditor array-vareditor column ' + className}
            style={style}
        >
            <div
                className='row'
                style={{
                    width: "auto",
                    padding: '0px 8px 8px 0px',
                    marginBottom: "4px",
                    overflow: "hidden"
                }}
            >
                {
                    name != null &&
                    <span
                        className='bold'
                        style={{paddingRight: '6px'}}
                    >
                            {name}
                    </span>
                }
                <span className='description center'>length: {elements.length}</span>
                <div className="flex"/>
                <div className="center">
                    <GoogleFontIconButton
                        className="add-button"
                        onClick={onAdd}
                        value="add"
                    />
                </div>
            </div>
            <div className='array-element column'>
                {
                    elements.map((element, index)=>{
                        return (
                            <div
                                key={index}
                                className="row"
                                style={{justifyContent: "center"}}
                            >
                                <NestedVarEditors
                                    className="flex"
                                    style={{
                                        paddingRight: "8px"
                                    }}
                                    name={`[${index}]`}
                                    item={item.element}
                                    value={element}
                                    onChange={(x)=>onEdit(index, x)}
                                />
                                <div
                                    className="noflex"
                                    style={{
                                        width: "22px",
                                        justifyContent: "center",
                                        alignItems: "flex-start"
                                    }}
                                >
                                    <GoogleFontIconButton
                                        className='delete-element-button'
                                        style={{
                                            height: "22px",
                                            marginTop : "4px"
                                        }}
                                        onClick={()=>onDelete(index)}
                                        value='delete'
                                    />
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}


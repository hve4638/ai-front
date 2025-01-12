import classNames from 'classnames';
import { PromptVar, PromptVarStruct } from 'types/prompt-variables';
import { GoogleFontIcon } from 'components/GoogleFontIcon';
import { initPromptVar } from '../utils';
import { Flex } from 'components/layout';

type StructAdditionProps = {
    promptVar:PromptVarStruct;
    fieldVarRef:React.MutableRefObject<PromptVar|null>|null;
    onRefresh:()=>void;
}

function StructAddition({
    promptVar,
    fieldVarRef,
    onRefresh
}:StructAdditionProps) {
    return (
    <>
        <hr/>
        <h2
            className='undraggable'
            style={{
                marginBottom: '0.2em',
            }}
        >필드</h2>
        {
            promptVar.fields != null &&
            promptVar.fields.map((field, index)=>(
                <div
                    className={classNames(
                        'undraggable',
                        'row-button',
                    )}
                    style={{
                        padding: '0px 4px 0px 16px',
                        fontSize: '0.9em',
                        height: '1.4em',
                    }}
                    onClick={()=>{
                        if (fieldVarRef) {
                            fieldVarRef.current = field;
                            console.log(fieldVarRef.current);
                            onRefresh();
                        }
                    }}
                >
                    <span>{field.display_name}</span>
                    <span
                        style={{
                            fontSize: '0.9em',
                            margin: 'auto 0px 0px 4px',
                            color: 'grey',
                        }}
                    >{field.name}</span>
                    <Flex/>
                    <GoogleFontIcon
                        style={{
                            width: '1.4em',
                            height: '1.4em',
                        }}
                        enableHoverEffect={true}
                        value='delete'
                        onClick={(e)=>{
                            e.preventDefault();
                            e.stopPropagation();

                            promptVar.fields.splice(index, 1);
                            if (fieldVarRef && fieldVarRef.current === field) {
                                fieldVarRef.current = null;
                            }
                            onRefresh();
                        }}
                    />
                </div>
            ))
        }
        <div
            className={classNames(
                'undraggable center',
                'row-button',
            )}
            onClick={()=>{
                if (promptVar.fields == null) {
                    promptVar.fields = [];
                }

                const field = {} as unknown as PromptVar;
                initPromptVar(field);
                promptVar.fields.push(field);
                onRefresh();
            }}
        >
            <GoogleFontIcon
                value='add_circle'
            />
            <span
                style={{
                    marginLeft: '0.5em',
                }}
            >
                필드 추가
            </span>
        </div>
    </>
    );
}

export default StructAddition;
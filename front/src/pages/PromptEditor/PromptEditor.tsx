import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { useTranslation } from "react-i18next";
import Editor, { useMonaco } from '@monaco-editor/react'
import { CBFParser, CBFFail } from '@hve/cbf';
import styles from './styles.module.scss';

import useSignal from 'hooks/useSignal';
import useLazyThrottle from 'hooks/useLazyThrottle';
import { PromptVar, PromptVarType } from 'types/prompt-variables';
import { calcTextPosition } from 'utils';
import { Align, Column, Flex, Grid, Row } from "components/layout";
import { GoogleFontIcon } from 'components/GoogleFontIcon';
import { TextInput } from 'components/Input';
import Button from 'components/Button';

import EditPromptVarModal from './EditPromptVarModal';
import RTTreeModal from 'pages/RTTreeModal';
import { PromptEditMode } from './types';

const parser = new CBFParser();

type PromptEditorProps = {
    mode: PromptEditMode;
}

function PromptEditor({
    mode=PromptEditMode.NEW,
}:PromptEditorProps) {
    const { t } = useTranslation();
    const editorRef = useRef<any>(null);
    const [name, setName] = useState('');
    const [promptText, setPromptText] = useState('');
    const [promptVars, setPromptVars] = useState<PromptVar[]>([]);
    const [showEditPromptVarModal, setShowEditPromptVarModal] = useState(false);
    const [showSavePromptModal, setShowSavePromptModal] = useState(false);
    const [currentEditPromptVar, setCurrentEditPromptVar] = useState<PromptVar|null>(null);
    const [refreshSignal, sendRefreshSignal] = useSignal();
    
    const monaco = useMonaco();
    const lint = useLazyThrottle((text:string)=>{
        const result = parser.build(text);
        if (result.errors.length === 0) {
            clearErrorMarker();
        }
        else {
            const markers = result.errors.map((e)=>{
                const {
                    line : startLineNumber,
                    column : startColumn,
                } = calcTextPosition(text, e.positionBegin);
                const {
                    line : endLineNumber,
                    column : endColumn,
                } = calcTextPosition(text, e.positionEnd);
                return {
                    message: t(`prompt.error.${e.type}`) + `(${e.type})`, 
                    startLineNumber : startLineNumber + 1,
                    endLineNumber : endLineNumber + 1,
                    startColumn : startColumn + 1,
                    endColumn : endColumn + 1,
                }
            });
            console.log('markers')
            console.log(markers)
            setErrorMarker(markers);
        }
    }, 500);

    const editorOptions = {
        minimap: { enabled: false },
        fontFamily: 'Noto Sans KR',
        quickSuggestions: false,
        contextmenu: false,
        lightbulb: { enabled: undefined },
    };

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;
    };
    
    useEffect(()=>{
        const handleKeyDown = (e:KeyboardEvent) => {
            if (e.ctrlKey && e.key.toLowerCase() == 's') {
                e.preventDefault();
                e.stopPropagation();
                console.log('save')
            }
        }
        window.addEventListener('keydown', handleKeyDown);
        return ()=>window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const setErrorMarker = (markers:{
        message:string,
        startLineNumber:number, startColumn:number,
        endLineNumber:number, endColumn:number,
    }[]) => {
        if (editorRef.current && monaco) {
            const editor = editorRef.current;
            const model = editor.getModel();

            monaco.editor.setModelMarkers(model, 'owner', 
                markers.map((ele)=>({
                    ...ele,
                    severity: monaco.MarkerSeverity.Error,
                }))
            );
        }
    };

    const clearErrorMarker = () => {
        if (editorRef.current && monaco) {
            const editor = editorRef.current;
            const model = editor.getModel();
            
            monaco.editor.setModelMarkers(model, 'owner', []);
        }
    }

    return (
        <div
            className={styles['prompt-editor']}
        >
            <div
                className={styles['editor']}
            >
                <Editor
                    options={editorOptions}
                    theme='vs-dark'
                    width='100%'
                    height='100%'
                    onChange={(value)=>{
                        lint(value ?? '');
                    }}
                    onMount={handleEditorDidMount}
                />
            </div>
            <Column
                className={styles['edit-panel']}
                style={{
                    width: '100%',
                    height: '100vh',
                    overflowY: 'auto',
                }}
            >
                <Row
                    style={{
                        width: '100%'
                    }}
                    rowAlign={Align.End}
                >
                    <GoogleFontIcon
                        enableHoverEffect={true}
                        className='noflex'
                        style={{
                            fontSize: '32px',
                            cursor: 'pointer',
                            margin: '4px'
                        }}
                        value='close'
                        onClick={()=>{

                        }}
                    />
                </Row>
                <Row
                    style={{
                        width: '100%'
                    }}
                    rowAlign={Align.SpaceBetween}
                    columnAlign={Align.Center}
                >
                    <span className='noflex'>이름</span>
                    <TextInput
                        className={classNames(styles['input'], 'flex')}
                        style={{
                            margin: '0px 8px',
                            padding: '0px 4px'
                        }}
                        value={name}
                        onChange={(value)=>setName(value)}
                    />
                </Row>
                <hr/>
                <h2
                    className='undraggable'
                    style={{
                        marginBottom: '4px'
                    }}
                >변수</h2>
                <div
                    style={{
                        display: 'block',
                        width: '100%',
                        overflowY: 'auto',
                    }}
                >
                {
                    promptVars.map((item, index)=>(
                        <Row
                            className={
                                classNames(
                                    'undraggable',
                                    'row-button'
                                )
                            }
                            style={{
                                width: '100%',
                                height: '36px',
                                padding: '4px 8px'
                            }}
                            onClick={()=>{
                                setCurrentEditPromptVar(item);
                                setShowEditPromptVarModal(true);
                            }}
                            
                        >
                            <span>{item.name}</span>
                            <Flex/>
                            <GoogleFontIcon
                                enableHoverEffect={true}
                                style={{
                                    fontSize: '20px',
                                    cursor: 'pointer',
                                    margin: 'auto 4px',
                                    width: '28px',
                                    height: '28px',
                                }}
                                value='delete'
                                onClick={(e)=>{
                                    e.preventDefault();
                                    e.stopPropagation();

                                    setPromptVars((prev) => {
                                        const newPromptVars = [...prev];
                                        newPromptVars.splice(index, 1);
                                        return newPromptVars;
                                    });
                                }}
                            />
                        </Row>
                    ))
                }
                </div>
                <div
                    className={classNames(
                        'undraggable center',
                        styles['add-var-button']
                    )}
                    onClick={()=>{
                        // setShowEditPromptVarModal(true);
                        setPromptVars((prev) => {
                            const newPromptVar:PromptVar = {
                                type: PromptVarType.Text,
                                name: 'new_var',
                                display_name: '변수',
                                allow_multiline: false,
                                default_value: '',
                                placeholder: '',
                            }

                            return [
                                ...prev,
                                newPromptVar
                            ]
                        });
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
                        변수 추가
                    </span>
                </div>
                <Flex/>
                <Row
                    className='noflex'
                    style={{
                        width: '100%',
                        height: '48px',
                        padding: '8px 0px'
                    }}
                >
                    <Button
                        className={styles['save-button']}
                        style={{
                            width: '100%',
                            height: '100%',
                        }}
                        onClick={()=>{
                            setShowSavePromptModal(true);
                        }}
                    >
                        { t('prompt.save_new') }
                    </Button>
                </Row>
            </Column>
            {
                showEditPromptVarModal &&
                currentEditPromptVar != null &&
                <EditPromptVarModal
                    promptVar={currentEditPromptVar}
                    onRefresh={sendRefreshSignal}
                    onClose={()=>{
                        setShowEditPromptVarModal(false);
                    }}
                />
            }
            {
                showSavePromptModal &&
                <RTTreeModal
                    item={[
                        
                    ]}
                    onConfirm={()=>{

                    }}
                    onCancel={()=>{
                        setShowSavePromptModal(false);
                    }}
                >

                </RTTreeModal>
            }
        </div>
    );
}

export default PromptEditor;
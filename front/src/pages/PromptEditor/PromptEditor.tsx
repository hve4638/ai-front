import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import Editor, { useMonaco } from '@monaco-editor/react'
import styles from './styles.module.scss';

import { PromptVar, PromptVarType } from 'types/prompt-variables';
import { Align, Column, Flex, Grid, Row } from "components/layout";
import { GoogleFontIcon } from 'components/GoogleFontIcon';
import { TextInput } from 'components/Input';

import EditPromptVarModal from './EditPromptVarModal';
import useSignal from 'hooks/useSignal';
import Button from 'components/Button';

function PromptEditor() {
    const editorRef = useRef<any>(null);
    const [name, setName] = useState('');
    const [promptText, setPromptText] = useState('');
    const [promptVars, setPromptVars] = useState<PromptVar[]>([]);
    const [showEditPromptVarModal, setShowEditPromptVarModal] = useState(false);
    const [currentEditPromptVar, setCurrentEditPromptVar] = useState<PromptVar|null>(null);
    const [refreshSignal, sendRefreshSignal] = useSignal();
    const monaco = useMonaco();

    const editorOptions = {
        minimap: { enabled: false },
        fontFamily: 'Noto Sans KR',
        fontSize: 15,
        quickSuggestions: false,
        contextmenu: false,
        lightbulb: { enabled: false }, // 퀵 픽스 아이콘 비활성화
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

    const setErrorMarker = () => {
        if (editorRef.current) {
            const editor = editorRef.current;
            const model = editor.getModel();
            
            console.log(monaco);
            monaco.editor.setModelMarkers(model, 'owner', [
            {
                startLineNumber: 1, // 에러 시작 라인
                startColumn: 2,     // 에러 시작 위치 (열)
                endLineNumber: 1,   // 에러 끝 라인
                endColumn: 15,      // 에러 끝 위치 (열)
                message: '여기 에러가 있습니다.', // 에러 메시지
                severity: monaco.MarkerSeverity.Error, // 에러 심각도
                disableSuggestions : false,
            },
            ]);
        }
      };

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
                        console.log(value)
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
                    <span>이름</span>
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
                        className='blue'
                        style={{
                            width: '100%',
                            height: '100%',
                        }}
                        onClick={()=>{
                            setErrorMarker();
                        }}
                    >
                        저장
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
        </div>
    );
}

export default PromptEditor;
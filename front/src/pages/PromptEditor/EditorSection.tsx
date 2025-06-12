import { useEffect, useRef, useState } from 'react';
import { useTranslation } from "react-i18next";
import Editor, { useMonaco } from '@monaco-editor/react';
import { PromptTemplate, CBFFail } from '@hve/prompt-template';

import useLazyThrottle from '@/hooks/useLazyThrottle';
import { calcTextPosition } from '@/utils';

import type { PromptEditorData } from '@/types';

import styles from './styles.module.scss';

type EditorSectionProps = {
    data:PromptEditorData;
}

function EditorSection({
    data,
}:EditorSectionProps) {
    const { t } = useTranslation();
    const monaco = useMonaco();
    const editorRef = useRef<any>(null);

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

    const lint = useLazyThrottle((text:string)=>{
        const result = PromptTemplate.build(text);
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
    
    return (
        <div
            className={styles['editor']}
        >
            <Editor
                options={editorOptions}
                theme='vs-dark'
                width='100%'
                height='auto'
                value={data.contents}
                onChange={(value)=>{
                    data.contents = value ?? '';
                    data.changed.contents = true;
                    lint(value ?? '');
                }}
                onMount={
                    (editor, monaco) => {
                        editorRef.current = editor;
                    }
                }
            />
        </div>
    )
}

export default EditorSection;
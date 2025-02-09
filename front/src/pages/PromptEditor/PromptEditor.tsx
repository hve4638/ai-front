import { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames';
import styles from './styles.module.scss';
import { useTranslation } from "react-i18next";

import { ProfileContext, useContextForce } from 'context';

import useSignal from 'hooks/useSignal';
import EditorSection from './EditorSection';
import SidePanel from './SidePanel';

import { PromptInputType } from 'types';
import { PromptData, PromptEditMode } from './types';
import { ModalProvider } from 'hooks/useModals';

type PromptEditorProps = {
    mode: PromptEditMode;
}

function PromptEditor({
    mode=PromptEditMode.NEW
}:PromptEditorProps) {
    const { t } = useTranslation();
    const { id } = useParams();
    const profileContext = useContextForce(ProfileContext);
    const [refreshSignal, sendRefreshSignal] = useSignal();
    const [loaded, setLoaded] = useState(false);

    
    const promptData = useRef<PromptData>({
        name: t('prompt.editor.default-name'),
        id: id ?? '0',
        vars: [],
        inputType: 'NORMAL',
        promptContent: '',
    });

    const [currentEditMode, setCurrentEditMode] = useState<PromptEditMode>(mode);

    const vars = promptData.current.vars;

    const addNewPromptVar = () => {
        let varName = '';
        let i = 0;
        while (true) {
            let candidateName = `variable_${i}`;    
            if (vars.some((item)=>item.name === candidateName)) {
                i++;
            }
            else {
                varName = candidateName;
                break;
            }
        }

        const newPromptVar:PromptVar = {
            type: 'text',
            name: varName,
            display_name: t('prompt.editor.new-variable'),
            allow_multiline: false,
            default_value: '',
            placeholder: '',
        }
        promptData.current?.vars.push(newPromptVar);
        sendRefreshSignal();
    }

    // NEW 인 경우 프롬프트 ID 초기화
    useEffect(()=>{
        (async ()=>{
            if (currentEditMode === PromptEditMode.NEW) {
                const newId = await profileContext.generateRTId()
                promptData.current = {
                    name: t('prompt.editor.default-name'),
                    id: newId,
                    vars: [],
                    inputType: 'NORMAL',
                    promptContent: '',
                }
                setLoaded(true);
                sendRefreshSignal();
            }
            else {
                if (id == null) {
                    console.error('rtId is not provided');
                    return;
                }
                const inputType = await profileContext.getRTMode(id);
                const promptText = await profileContext.getRTPromptText(id);
                promptData.current = {
                    name: metadata.name,
                    id: id,
                    vars: [],
                    inputType: 'NORMAL',
                    promptContent: promptText,
                }
                setLoaded(true);
                sendRefreshSignal();
            }
        })();
    }, []);


    if (!loaded) {
        return <></>
    }
    return (
        <ModalProvider>
            <div
                className={styles['prompt-editor']}
            >
                <EditorSection
                
                />
                <SidePanel
                    promptData={promptData.current}
                    onRefresh={()=>sendRefreshSignal()}
                    onBack={()=>{
                        console.log('click back');
                    }}

                    onAddPromptVarClick={()=>{
                        addNewPromptVar();
                    }}
                    onRemovePromptVarClick={(promptVar:PromptVar)=>{
                        promptData.current.vars = vars.filter((item)=>item.name !== promptVar.name);
                        sendRefreshSignal();
                    }}
                    onChangeInputType={(inputType:PromptInputType)=>{
                        promptData.current.inputType = inputType;
                        sendRefreshSignal();
                    }}
                />
            </div>
        </ModalProvider>
    );
}

export default PromptEditor;
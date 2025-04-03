import { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames';
import styles from './styles.module.scss';
import { useTranslation } from "react-i18next";

import useSignal from 'hooks/useSignal';
import EditorSection from './EditorSection';
import SidePanel from './SidePanel';

import { PromptInputType } from 'types';
import { PromptData, PromptEditMode } from './types';
import { ModalProvider } from 'hooks/useModal';
import { PromptEditAction } from './types/prompt-editor';
import useProfile from 'hooks/context/useProfile';
import { useRT } from 'hooks/context';
import { useNavigate } from 'react-router';

type PromptEditorProps = {
    action : PromptEditAction;
    mode: PromptEditMode;
}

function PromptEditor({
    mode,
    action
}:PromptEditorProps) {
    const { t } = useTranslation();
    const { rtId } = useParams();
    const navigate = useNavigate();
    const profile = useProfile();
    const rt = useRT();
    
    const [_, sendRefreshSignal] = useSignal();
    const [loaded, setLoaded] = useState(false);

    const promptActionRef = useRef(action);
    const promptData = useRef<PromptData>({
        name: t('prompt_editor.prompt_default_name'),
        id: rtId ?? '0',
        forms: [],
        inputType: 'NORMAL',
        contents: '',
    });

    const addNewPromptVar = () => {
        let varName = '';
        let i = 0;
        while (true) {
            let candidateName = `variable_${i}`;    
            if (promptData.current.forms.some((item)=>item.name === candidateName)) {
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
            display_name: t('prompt_editor.variable_default_name'),
            allow_multiline: false,
            default_value: '',
            placeholder: '',
        }
        promptData.current?.forms.push(newPromptVar);
        sendRefreshSignal();
        return newPromptVar;
    }

    // NEW 인 경우 프롬프트 ID 초기화
    useEffect(()=>{
        (async ()=>{
            promptData.current = await rt.loadPromptData('default');
            setLoaded(true);
            sendRefreshSignal();
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
                    promptData={promptData.current}
                />
                <SidePanel
                    promptData={promptData.current}
                    onRefresh={()=>sendRefreshSignal()}
                    onSave={async (tree:RTMetadataTree)=>{
                        // not implemented
                    }}
                    onBack={()=>{
                        navigate('/');
                    }}

                    onAddPromptVarClick={()=>{
                        return addNewPromptVar();
                    }}
                    onRemovePromptVarClick={(promptVar:PromptVar)=>{
                        promptData.current.forms = promptData.current.forms.filter((item)=>item.name !== promptVar.name);
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
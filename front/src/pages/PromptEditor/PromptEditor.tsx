import { useContext, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { useTranslation } from "react-i18next";
import styles from './styles.module.scss';

import useSignal from 'hooks/useSignal';
import { PromptVar, PromptVarType } from 'types/prompt-variables';
import { Align, Column, Flex, Grid, Row } from "components/layout";
import { GoogleFontIcon } from 'components/GoogleFontIcon';
import { TextInput } from 'components/Input';
import Button from 'components/Button';

import EditPromptVarModal from './EditPromptVarModal';
import RTTreeModal from 'pages/RTTreeModal';
import { PromptData, PromptEditMode } from './types';
import EditPromptMetadataModal from './EditPromptMetadataModal';
import EditorSection from './EditorSection';
import SidePanel from './SidePanel';
import { PromptInputType } from 'types';
import { ProfileContext, useContextForce } from 'context';
import { RTNode, RTNodeTree } from 'types/rt-node';
import { hotkey } from 'features/hotkey';
import useHotkey from 'hooks/useHotkey';
import { mapRTMetadataToNode } from 'utils/rt';

type PromptEditorProps = {
    mode: PromptEditMode;
}

const Modals = {
    NONE : 'NONE',
    EDIT_PROMPT_METADATA: 'EDIT_PROMPT_METADATA',
    EDIT_PROMPT_VAR: 'EDIT_PROMPT_VAR',
    SAVE_PROMPT: 'SAVE_PROMPT',
} as const;
type Modals = typeof Modals[keyof typeof Modals];

function PromptEditor({
    mode=PromptEditMode.NEW,
}:PromptEditorProps) {
    const { t } = useTranslation();
    const profileContext = useContextForce(ProfileContext);
    const lastPromptData = useRef<PromptData|null>(null);
    const promptData = useRef<PromptData>({
        name: t('prompt.editor.default-name'),
        id: 'rtid-1',
        vars: [],
        inputType: 'NORMAL',
        promptContent: '',
    });
    const [currentMode, setCurrentMode] = useState<PromptEditMode>(mode);
    const [currentEditPromptVar, setCurrentEditPromptVar] = useState<PromptVar|null>(null);
    const [displayedModal, setDisplayedModal] = useState<Modals>(Modals.NONE);
    const [refreshSignal, sendRefreshSignal] = useSignal();

    const [rtTree, setRTTree] = useState<RTMetadataTree>([]);

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
            type: PromptVarType.Text,
            name: varName,
            display_name: t('prompt.editor.new-variable'),
            allow_multiline: false,
            default_value: '',
            placeholder: '',
        }
        promptData.current.vars.push(newPromptVar);
        sendRefreshSignal();
    }

    // 저장 버튼 클릭시
    const handleSaveTrigger = () => {
        if (currentMode === PromptEditMode.NEW) {
            prepareNewPromptSave();
        }
        else {
            prepareExistingPromptSave();
        }
    }

    const prepareNewPromptSave = async () => {
        const metadata = await profileContext.getRTTree();
        const rtTree = mapRTMetadataToNode(metadata);
        setRTTree([
            ...rtTree,
            {
                type : 'node',
                name : promptData.current.name,
                id : promptData.current.id,
                added : true,
                edited : false,
            }
        ]);
        setDisplayedModal(Modals.SAVE_PROMPT);
    }

    const prepareExistingPromptSave = async () => {
        ;
    }

    const saveNewPrompt = async (tree:RTNodeTree) => {
        await profileContext.addRT({
            type : 'node',
            name : promptData.current.name,
            id : promptData.current.id,
        })
        await profileContext.updateRTTree(tree);
        await profileContext.setRTPromptText(promptData.current.id, promptData.current.promptContent);
        
        lastPromptData.current = { ...promptData.current };
        promptData.current
        setCurrentMode(PromptEditMode.EDIT);
        sendRefreshSignal();
    }
    const saveExistingPrompt = async (tree:RTNodeTree) => {

    }

    useHotkey({
        's' : (e)=>{
            if (e.ctrlKey) {
                handleSaveTrigger();
                return true;
            }
        }
    }, displayedModal === Modals.NONE);

    // NEW 인 경우 프롬프트 ID 초기화
    useEffect(()=>{
        profileContext.createRTId()
            .then((id)=>{
                promptData.current.id = id;
                sendRefreshSignal();
            });
    }, []);

    return (
        <div
            className={styles['prompt-editor']}
        >
            <EditorSection
            
            />
            <SidePanel
                promptData={promptData.current}
                onRefresh={()=>sendRefreshSignal()}
                onSaveClick={()=>handleSaveTrigger()}
                onCancelClick={()=>{
                    console.log('cancel');
                }}
                onEditMetadataClick={()=>{
                    setDisplayedModal(Modals.EDIT_PROMPT_METADATA);
                }}
                onAddPromptVarClick={()=>{
                    addNewPromptVar();
                }}
                onEditPromptVarClick={(promptVar:PromptVar)=>{
                    setCurrentEditPromptVar(promptVar);
                    setDisplayedModal(Modals.EDIT_PROMPT_VAR);
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
            {
                displayedModal === Modals.EDIT_PROMPT_METADATA &&
                <EditPromptMetadataModal
                    metadata={promptData.current}
                    onChange={async (next)=>{
                        if (promptData.current.id === next.id || !await profileContext.hasRTId(next.id)) {
                            promptData.current.name = next.name;
                            promptData.current.id = next.id;
                            sendRefreshSignal();
                            return true;
                        }
                        return false;
                    }}
                    onClose={()=>{
                        setDisplayedModal(Modals.NONE);
                    }}
                />
            }
            {
                displayedModal === Modals.EDIT_PROMPT_VAR &&
                currentEditPromptVar != null &&
                <EditPromptVarModal
                    promptVar={currentEditPromptVar}
                    onRefresh={sendRefreshSignal}
                    onClose={()=>{
                        setDisplayedModal(Modals.NONE);
                    }}
                />
            }
            {
                displayedModal === Modals.SAVE_PROMPT &&
                <RTTreeModal
                    item={rtTree}
                    onConfirm={async (tree:RTMetadataTree)=>{
                        if (currentMode === PromptEditMode.NEW) {
                            await saveNewPrompt(tree);
                        }
                        console.log('save');
                        console.log('rtTree', rtTree);
                    }}
                    onCancel={()=>{
                        
                    }}
                    onClose={()=>{
                        setDisplayedModal(Modals.NONE);
                    }}
                >

                </RTTreeModal>
            }
        </div>
    );
}

export default PromptEditor;
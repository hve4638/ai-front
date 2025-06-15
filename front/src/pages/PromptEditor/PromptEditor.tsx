import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';
import { useTranslation } from "react-i18next";

import { RTStoreContext, useContextForce } from '@/context';
import { ModalProvider, useModal } from '@/hooks/useModal';
import useSignal from '@/hooks/useSignal';
import type {
    PromptEditorData,
    PromptInputType
} from '@/types';

import EditorSection from './EditorSection';
import SidePanel from './SidePanel';

import styles from './styles.module.scss';
import { fixPromptVar } from './utils';
import { ChoiceDialog } from '@/modals/Dialog';

function PromptEditor() {
    const { t } = useTranslation();
    const modal = useModal();
    const navigate = useNavigate();
    const { rtId, promptId } = useParams();

    const rtState = useContextForce(RTStoreContext);

    const [_, refresh] = useSignal();
    const [loaded, setLoaded] = useState(false);

    // 저장 후 일시적으로 '저장됨' 표시 및 버튼 비활성화를 위함
    const [saved, setSaved] = useState(false);

    const editorData = useRef<PromptEditorData>({
        rtId: rtId ?? '',
        promptId: promptId ?? '',

        name: null,
        version: '1.0.0',
        model: {
            temperature: 1.0,
            topP: 1.0,
            maxTokens: 1024,
        },
        variables: [],
        changedVariables: [],
        removedVariables: [],
        contents: '',
        config: {
            inputType: 'normal',
        },

        changed: {},
        flags: {},
    });

    const isChanged = () => {
        const changed = Object.entries(editorData.current.changed).some(([key, value]) => value === true);
        if (
            changed ||
            editorData.current.changedVariables.length > 0 ||
            editorData.current.removedVariables.length > 0
        ) {
            return true;
        }
        else {
            return false;
        }
    }

    const save = async () => {
        if (!rtId || !promptId) return;

        console.log('[saved]');

        const data = editorData.current;
        if (data.changed.name && data.name) {
            await rtState.update.promptName(promptId, data.name);
        }
        if (data.changed.version && data.version) {
            await rtState.update.metadata({
                version: data.version
            });
        }

        if (data.changed.config) {
            await rtState.update.metadata({
                input_type: data.config.inputType
            });
        }
        if (data.changed.model || data.changed.contents) {
            await rtState.update.promptMetadata(data.promptId, {
                model: {
                    temperature: data.model.temperature,
                    top_p: data.model.topP,
                    max_tokens: data.model.maxTokens,
                },
                contents: data.contents,
            });
        }

        if (data.changedVariables.length > 0) {
            data.variables.forEach((promptVar) => fixPromptVar(promptVar));
            const variableIds = await rtState.update.promptVars(data.promptId, data.changedVariables);

            for (const i in variableIds) {
                data.variables[i].id = variableIds[i];
            }
        }
        if (data.removedVariables.length > 0) {
            await rtState.remove.promptVars(data.promptId, data.removedVariables);
        }
        // if (data.changed.contents) {
        //     await rtState.update.promptContents(data.promptId, data.contents);
        // }

        setSaved(true);
        data.changed = {};
        data.changedVariables = [];
        data.removedVariables = [];
    }

    // 초기 프롬프트 데이터 로드
    const load = async () => {
        if (!rtId || !promptId) return;

        const { input_type, mode } = await rtState.get.metadata();
        const { name, model } = await rtState.get.promptMetadata(promptId);
        const contents = await rtState.get.promptContents(promptId);
        const vars = await rtState.get.promptVars(promptId);

        editorData.current.name = name;
        if (model) {
            /// @TODO : 원래 model은 반드시 valid하게 와야하는데 {}만 오는 문제
            editorData.current.model = {
                temperature: model.temperature ?? 1.0,
                topP: model.top_p ?? 1.0,
                maxTokens: model.max_tokens ?? 1024,
            };
        }
        editorData.current.contents = contents;
        editorData.current.changed = {};
        editorData.current.removedVariables = [];
        editorData.current.variables = vars;
        editorData.current.config.inputType = input_type;
        setLoaded(true);
        refresh();
    }

    const back = () => {
        if (isChanged()) {
            modal.open(ChoiceDialog, {
                title: '작업을 저장하겠습니까?',
                choices: [
                    { text: '저장', tone: 'highlight' },
                    { text: '저장하지 않음' },
                    { text: '취소', tone: 'dimmed' },
                ],
                onSelect: async (choice: string, index: number) => {
                    if (index === 0) {
                        await save();
                        navigate('/');
                    }
                    else if (index === 1) {
                        navigate('/');
                    }
                    else if (index === 2) {
                        return true;
                    }
                    return true;
                },
                onEnter: async () => {
                    await save();
                    navigate('/');
                    return true;
                },
                onEscape: async () => true,

                children: <span>저장되지 않은 변경사항이 있습니다</span>,
            });
        }
        else {
            navigate('/');
        }
    }

    const addPromptVar = () => {
        let varName = '';
        let i = 0;
        while (true) {
            let candidateName = `variable_${i}`;
            if (editorData.current.variables.some((item) => item.name === candidateName)) {
                i++;
            }
            else {
                varName = candidateName;
                break;
            }
        }

        const newPromptVar: PromptVar = {
            type: 'text',
            name: varName,
            display_name: t('prompt_editor.variable_default_name') + ' ' + i,
            allow_multiline: false,
            default_value: '',
            placeholder: '',
        }

        editorData.current.variables.push(newPromptVar);
        editorData.current.changedVariables.push(newPromptVar);
        // editorData.current.changed.variables = true;

        refresh();

        return newPromptVar;
    }

    useEffect(() => {
        load();
    }, []);

    // 저장 후 버튼 비활성화 타이머
    useEffect(() => {
        if (!saved) return;

        const timeoutId = window.setTimeout(() => {
            setSaved(false);
        }, 300);

        return () => {
            window.clearTimeout(timeoutId);
        }
    }, [saved]);

    if (!loaded) {
        return <></>
    }
    return (
        <div
            className={styles['prompt-editor']}
        >
            <EditorSection data={editorData.current} />
            <SidePanel
                data={editorData.current}
                saved={saved}

                onRefresh={() => refresh()}
                onSave={async () => await save()}
                onBack={async () => back()}

                onAddPromptVar={() => {
                    const promptVar = addPromptVar();

                    return promptVar;
                }}
                onRemovePromptVar={(promptVar: PromptVar) => {
                    editorData.current.variables = editorData.current.variables.filter((item) => item !== promptVar);
                    editorData.current.changedVariables = editorData.current.changedVariables.filter((item) => item !== promptVar);
                    if (promptVar.id) {
                        editorData.current.removedVariables.push(promptVar.id);
                    }

                    refresh();
                }}
                onChangeInputType={(inputType: PromptInputType) => {
                    return;
                }}
            />
        </div>
    );
}

function PromptEditorWrapper() {
    return (
        <ModalProvider>
            <PromptEditor />
        </ModalProvider>
    )
}

export default PromptEditorWrapper;
import React, { useState, useEffect, useContext } from "react";
import ArrowIcon from '../../assets/icons/arrow.svg'
import LoadingIcon from '../../assets/icons/loading.svg'

import { PromptContext } from "../../context/PromptContext.tsx";
import { StateContext } from "../../context/StateContext.tsx";
import { APIContext } from "../../context/APIContext.tsx";
import { DebugContext } from "../../context/DebugContext.tsx";

import ModalBackground from '../../components/ModalBackground.tsx'
import RequestInfoModal from "../RequestInfoModal/RequestInfoModal.tsx";
import HistoryModal from '../HistoryModal/HistoryModal.tsx'
import SettingModal from '../SettingModal/SettingModal.tsx'
import MessageModal from "../MessageModal/MessageModal.tsx";

import { APIResponse } from "../../data/interface.tsx";

import Header from './Header.tsx'
import Footer from './Footer.tsx'
import InputField from './InputField.tsx'
import OutputField from './OutputField.tsx'

import { CurlyBraceFormatParser } from "../../libs/curlyBraceFormat/index.ts";
import { AIModels } from "../../features/chatAI/index.ts";
import VarEditorModal from "../VarEditorModal/VarEditorModal.tsx";
import DebugModal from "../DebugModal/DebugModal.tsx";

const MODALS = {
    SettingModal : "SettingModal",
    RequestInfoModal : "RequestInfoModal",
    HistoryModal : "HistoryModal",
    VarEditorModal : "VarEditorModal",
    DebugModal : "DebugModal",
    MessageModal : "MessageModal",
} as const;
type MODALS = typeof MODALS[keyof typeof MODALS];

export default function Home() {
    const [currentModal, setCurrentModal] = useState<MODALS|null>(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [response, setResponse] = useState<APIResponse>({
        input: '', output : '',
        prompt: '',
        note : {},
        tokens: 0,
        warning: null,
        error : null,
        finishreason : '',
        normalresponse : true,
    });
    const [textInput, setTextInput] = useState('');

    const apiContext = useContext(APIContext);
    const promptContext = useContext(PromptContext);
    const stateContext = useContext(StateContext);
    const debugContext = useContext(DebugContext);
    if (promptContext == null) throw new Error('Home() required PromptContextProvider');
    if (apiContext == null) throw new Error('Home() required APIContextProvider');
    if (stateContext == null) throw new Error('Home() required StateContextProvider');
    if (debugContext == null) throw new Error('Home() required DebugContextProvider');
    

    const onSubmit = () => {
        const promise = AIModels.request(
            {
                contents: textInput,
                note: stateContext.note,
                prompt: stateContext.promptContents
            },
            {
                apiContext,
                stateContext
            }
        )
        setSubmitLoading(true);

        promise
        .then(response=>{
            const newhistory = [...stateContext.history]
            newhistory.push(response);
            stateContext.setHistory(newhistory);
            setResponse(response);
        })
        .catch(err=>{
            const errorResponse = {
                input : textInput,
                output : '',
                prompt : stateContext.promptContents,
                note : stateContext.note,
                tokens: 0,
                finishreason : 'EXCEPTION',
                normalresponse : false,
                warning : null,
                error: ''
            };
            if (typeof(err) == 'string') {
                errorResponse.error = err;
            }
            else {
                errorResponse.error = `${err}`;
            }
            setResponse(errorResponse);
            console.error(err);
        })
        .finally(()=>{
            setSubmitLoading(false);
        })

        // @TODO : 호환성을 위해 사용하지 않은 controller 리턴함. 구조 변경 필요
        return new AbortController();
    }

    const loadHistory = (response:APIResponse) => {
        setTextInput(response.input ?? '');
        setResponse(response);
    }

    const onChanageInputField = (value) => {
        if (debugContext.isDebugMode && debugContext.mirror) {
            try {
                const tp = new CurlyBraceFormatParser(value);
                
                const text = tp.build(
                    {
                        vars: stateContext.note,
                        reservedVars : { input: 'test message' }
                    }
                );
            }
            catch(e){
                console.error(e);
            }
            setResponse({
                input : value,
                output : value,
                error : '',
                finishreason : 'NORMAL',
                normalresponse : true,
                note : {},
                prompt : '',
                tokens : 0,
                warning : ''
            });
        }
        else {

        }
        setTextInput(value);
    }

    return (
        <div className='fill column' style={{position:'relative'}}>
            <Header
                onOpenHistory={()=>setCurrentModal(MODALS.HistoryModal)}
                onOpenModelConfig={()=>setCurrentModal(MODALS.RequestInfoModal)}
                onOpenSetting={()=>setCurrentModal(MODALS.SettingModal)}
                onOpenVarEditor={()=>setCurrentModal(MODALS.VarEditorModal)}
            />
            <main className='flex row' style={{overflowY: 'auto'}}>
                <InputField
                    className='left-section'
                    text={textInput}
                    onChange={(value)=>onChanageInputField(value)}
                />
                <div className='seperate-section center undraggable'>
                    <SubmitButton
                        loading={submitLoading}
                        onSubmit={()=>onSubmit()}
                        onAbort={(controller)=>controller.abort()}
                    />
                </div>
                <OutputField
                    className='right-section'
                    response={response}
                />
            </main>
            <Footer
                onOpenDebug={()=>setCurrentModal(MODALS.DebugModal)}
            />
            {
                (currentModal !== null) &&
                <ModalBackground>
                {
                    (currentModal === MODALS.SettingModal) &&
                    <SettingModal
                        onClose = {()=>setCurrentModal(null)}
                    />
                }
                {
                    (currentModal === MODALS.RequestInfoModal) &&
                    <RequestInfoModal
                        onClose = {()=>setCurrentModal(null)}
                    />
                }
                {
                    (currentModal === MODALS.HistoryModal) &&
                    <HistoryModal
                        onClose = {()=>setCurrentModal(null)}
                        onClick = {(history)=>{
                            loadHistory(history);
                            setCurrentModal(null);
                        }}
                    />
                }
                {
                    (currentModal === MODALS.VarEditorModal) &&
                    <VarEditorModal
                        onClose = {()=>setCurrentModal(null)}
                    />
                }
                {
                    (currentModal === MODALS.DebugModal) &&
                    <DebugModal
                        onClose = {()=>setCurrentModal(null)}
                    />
                }
                {
                    (currentModal === MODALS.MessageModal) &&
                    <MessageModal
                        title="업데이트 알림"
                        onClose = {()=>setCurrentModal(null)}
                    />
                }
                </ModalBackground>
            }
        </div>
    )
}

interface SubmitButtonProps {
    loading:boolean,
    onSubmit:()=>AbortController,
    onAbort:(controller:AbortController)=>void
}

function SubmitButton({loading, onSubmit, onAbort}:SubmitButtonProps) {
    const [controller, setController] = useState<AbortController|null>(null);

    return (
        <>
        {
            !loading && 
            <img 
            id='submit-button'
            src={ArrowIcon}
            draggable='false'
            onClick={(e)=>{
                const newController = onSubmit()
                setController(newController);
            }}
            />
        }
        {
            loading && 
            <img 
            className='rotate'
            src={LoadingIcon}
            draggable='false'
            onClick={(e)=>{
                if (controller != null) {
                    onAbort(controller);
                }
            }}
            />
        }
        </>
    );
}

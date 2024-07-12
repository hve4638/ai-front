import React, { useState, useEffect, useContext } from "react";
import ArrowIcon from '../../assets/icons/arrow.svg'
import LoadingIcon from '../../assets/icons/loading.svg'

import { PromptContext } from "../../context/PromptContext.tsx";
import { StoreContext } from "../../context/StoreContext.tsx";
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

import { AIModels } from "../../features/chatAI/index.ts";
import VarEditorModal from "../VarEditorModal/VarEditorModal.tsx";
import DebugModal from "../DebugModal/DebugModal.tsx";
import { MemoryContext } from "../../context/MemoryContext.tsx";

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
    const apiContext = useContext(APIContext);
    const promptContext = useContext(PromptContext);
    const memoryContext = useContext(MemoryContext);
    const storeContext = useContext(StoreContext);
    const debugContext = useContext(DebugContext);
    if (promptContext == null) throw new Error('Home() required PromptContextProvider');
    if (apiContext == null) throw new Error('Home() required APIContextProvider');
    if (storeContext == null) throw new Error('Home() required StoreContextProvider');
    if (memoryContext == null) throw new Error('Home() required MemoryContextProvider');
    if (debugContext == null) throw new Error('Home() required DebugContextProvider');

    const [currentModal, setCurrentModal] = useState<MODALS|null>(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const {
        currentSession,
        currentHistory, setCurrentHistory,
        currentResponse, setCurrentResponse,
        apiSubmitPing,
    } = memoryContext;

    useEffect(()=>{
        if (!apiSubmitPing) return;

        onSubmit();
    }, [apiSubmitPing])

    const onSubmit = () => {
        const promise = AIModels.request(
            {
                contents: currentResponse.input ?? "",
                note: storeContext.note,
                prompt: memoryContext.promptText
            },
            {
                apiContext,
                storeContext
            }
        )
        setSubmitLoading(true);

        promise
        .then(response=>{
            const newhistory = [...currentHistory]
            newhistory.push(response);
            setCurrentHistory(newhistory);
            setCurrentResponse(response);
        })
        .catch(err=>{
            const errorResponse = {
                input : currentResponse.input ?? "",
                output : '',
                prompt : memoryContext.promptText,
                note : memoryContext.currentSession.note,
                tokens: 0,
                finishreason : 'EXCEPTION',
                normalresponse : false,
                warning : null,
                error: `${err}`
            };
            setCurrentResponse(errorResponse);
            console.error(err);
        })
        .finally(()=>{
            setSubmitLoading(false);
        })

        // @TODO : 호환성을 위해 사용하지 않은 controller 리턴함. 구조 변경 필요
        return new AbortController();
    }

    const loadHistory = (response:APIResponse) => {
        setCurrentResponse(response);
    }
    
    const onChanageInputField = (value) => {
        const newResponse = {...currentResponse};
        newResponse.input = value;
        if (debugContext.isDebugMode && debugContext.mirror) {
            newResponse.output = value;
        }
        setCurrentResponse(newResponse);
    }

    return (
        <div
            id='home'
            className={`fill column ${currentSession.color ?? ''}`}
            style={{ position:'relative'}} 
        >
            <Header
                onOpenHistory={()=>setCurrentModal(MODALS.HistoryModal)}
                onOpenModelConfig={()=>setCurrentModal(MODALS.RequestInfoModal)}
                onOpenSetting={()=>setCurrentModal(MODALS.SettingModal)}
                onOpenVarEditor={()=>setCurrentModal(MODALS.VarEditorModal)}
            />
            <main className='flex row' style={{overflowY: 'auto'}}>
                <InputField
                    className='left-section'
                    text={currentResponse.input ?? ""}
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
                    response={currentResponse}
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

import React, { useState, useEffect, useContext } from "react";

import { APIResponse, FetchStatus } from "data/interface";

import { PromptContext } from "context/PromptContext";
import { StoreContext } from "context/StoreContext";
import { SecretContext } from "context/SecretContext";
import { DebugContext } from "context/DebugContext";
import { MemoryContext } from "context/MemoryContext";
import { EventContext } from "context/EventContext";

import ModalBackground from 'components/ModalBackground'
import { SubmitButton } from "./components/SubmitButton";

import RequestInfoModal from "pages/RequestInfoModal/RequestInfoModal";
import HistoryModal from 'pages/HistoryModal/HistoryModal'
import SettingModal from 'pages/SettingModal/SettingModal'
import VarEditorModal from "pages/VarEditorModal/VarEditorModal";
import DebugModal from "pages/DebugModal/DebugModal";
import { ModelSettingModal } from "pages/ModelSettingModal/ModelSettingModal";

import Header from './Header'
import Footer from './Footer'
import InputField from './InputField'
import OutputField from './OutputField'

enum MODALS {
    SettingModal,
    RequestInfoModal,
    HistoryModal,
    VarEditorModal,
    DebugModal,
    MessageModal,
    ModelSettingModal,
};

export default function Home() {
    const secretContext = useContext(SecretContext);
    const promptContext = useContext(PromptContext);
    const memoryContext = useContext(MemoryContext);
    const storeContext = useContext(StoreContext);
    const eventContext = useContext(EventContext);
    const debugContext = useContext(DebugContext);
    if (!promptContext) throw new Error('Home required PromptContextProvider');
    if (!secretContext) throw new Error('Home required SecretContextProvider');
    if (!storeContext) throw new Error('Home required StoreContextProvider');
    if (!memoryContext) throw new Error('Home required MemoryContextProvider');
    if (!eventContext) throw new Error('Home required EventContextProvider');
    if (!debugContext) throw new Error('Home required DebugContextProvider');

    const [currentModal, setCurrentModal] = useState<MODALS|null>(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const {
        currentSession,
        currentChat, setCurrentChat,
        apiSubmitPing, setApiSubmitPing,
        sessionFetchStatus,
    } = memoryContext;
    const {
        enqueueApiRequest,
        getFetchStatus
    } = eventContext;
    const {
        setResponses, responses
    } = storeContext;

    // Ctrl+Enter 핑
    useEffect(()=>{
        if (apiSubmitPing) {
            onSubmit();
            setApiSubmitPing(false);
        }
    }, [apiSubmitPing]);

    useEffect(()=>{
        const status = getFetchStatus(currentSession);
        setSubmitLoading(status === FetchStatus.PROCESSING || status === FetchStatus.QUEUED);
    }, [currentSession, sessionFetchStatus])

    const onSubmit = () => {
        if (currentChat.input) {
            enqueueApiRequest({
                session:currentSession,
                input:currentChat.input,
                promptText:memoryContext.promptText
            })
        }
        return new AbortController();
    }

    const loadHistory = (response:APIResponse) => {
        const newResponses = {...responses};
        newResponses[currentSession.id] = response;
        setResponses(newResponses);
        setCurrentChat(response);
    }
    
    const onChanageInputField = (value) => {
        const newResponse = {...currentChat};
        newResponse.input = value;
        if (debugContext.isDebugMode && debugContext.mirror) {
            newResponse.output = value;
        }
        setCurrentChat(newResponse);
    }

    return (
        <div
            id='home'
            className={currentSession.color ?? ''}
        >
            <Header
                onOpenHistory={()=>setCurrentModal(MODALS.HistoryModal)}
                onOpenRequestInfo={()=>setCurrentModal(MODALS.RequestInfoModal)}
                onOpenModelSetting={()=>setCurrentModal(MODALS.ModelSettingModal)}
                onOpenSetting={()=>setCurrentModal(MODALS.SettingModal)}
                onOpenVarEditor={()=>setCurrentModal(MODALS.VarEditorModal)}
            />
            <main id='app-main'>
                <InputField
                    text={currentChat.input ?? ""}
                    onChange={(value)=>onChanageInputField(value)}
                    onSubmit={()=>onSubmit()}
                    loading={submitLoading}
                />
                <div className='seperate-section center undraggable'>
                    <SubmitButton
                        className='submit-button seperate-section-item'
                        loading={submitLoading}
                        onSubmit={()=>onSubmit()}
                        onAbort={()=>{}}
                    />
                </div>
                <OutputField
                    response={currentChat}
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
                    (currentModal === MODALS.ModelSettingModal) &&
                    <ModelSettingModal
                        onClose = {()=>setCurrentModal(null)}
                    />
                }
                </ModalBackground>
            }
        </div>
    )
}
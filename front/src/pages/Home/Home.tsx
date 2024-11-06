import React, { useState, useEffect, useContext } from "react";

import { APIResponse, FetchStatus } from "data/interface";

import {
    useContextForce,
    StoreContext,
    SecretContext,
    DebugContext,
    MemoryContext,
    EventContext,
} from "context";

import ModalBackground from 'components/ModalBackground'
import { SubmitButton } from "./components/SubmitButton";

import RequestInfoModal from "pages/RequestInfoModal/RequestInfoModal";
import HistoryModal from 'pages/HistoryModal/HistoryModal'
import SettingModal from 'pages/SettingModal/SettingModal'
import {VarEditorModal} from "pages/VarEditorModal";
import DebugModal from "pages/DebugModal/DebugModal";
import { ModelSettingModal } from "pages/ModelSettingModal/ModelSettingModal";

import Header from './Header'
import Footer from './Footer'
import InputField from './InputField'
import OutputField from './OutputField'
import { ErrorLogModal } from "pages/ErrorLogModal";

const enum MODALS {
    SettingModal,
    RequestInfoModal,
    HistoryModal,
    VarEditorModal,
    DebugModal,
    MessageModal,
    ModelSettingModal,
    ErrorLogModal,
};

export default function Home() {
    const memoryContext = useContextForce(MemoryContext);
    const storeContext = useContextForce(StoreContext);
    const eventContext = useContextForce(EventContext); 
    const debugContext = useContextForce(DebugContext);

    const [currentModal, setCurrentModal] = useState<MODALS|null>(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const {
        currentSession,
        currentChat, setCurrentChat,
        apiSubmitPing, setApiSubmitPing,
        sessionFetchStatus,
        profile,
    } = memoryContext;
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

    // 현 세션이 API요청 중인지 여부를 확인
    useEffect(()=>{
        const status = eventContext.getFetchStatus(currentSession);
        
        setSubmitLoading(status === FetchStatus.PROCESSING || status === FetchStatus.QUEUED);
    }, [currentSession, sessionFetchStatus])

    const onSubmit = () => {
        if (currentChat.input && !submitLoading) {
            eventContext.enqueueApiRequest({
                session:currentSession,
                input:currentChat.input,
                promptText:memoryContext.promptText,
                promptMetadata:memoryContext.promptMetadata,
            })
        }

        /// 이전 코드 호환성을 위해 존재함. 추후 삭제 필요
        return new AbortController();
    }
    
    const loadChatFromHistory = (response:APIResponse) => {
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
                onOpenErrorLog={()=>setCurrentModal(MODALS.ErrorLogModal)}
            />
            <main id='app-main'>
                <InputField
                    text={currentChat.input ?? ''}
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
                            loadChatFromHistory(history);
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
                {
                    (currentModal === MODALS.ErrorLogModal) &&
                    <ErrorLogModal
                        onClose = {()=>setCurrentModal(null)}
                    />
                }
                </ModalBackground>
            }
        </div>
    )
}
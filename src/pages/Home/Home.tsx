import React, { useState, useEffect, useContext } from "react";
import ArrowIcon from '../../assets/icons/arrow.svg'
import LoadingIcon from '../../assets/icons/loading.svg'

import { PromptContext } from "../../context/PromptContext.tsx";
import { StoreContext } from "../../context/StoreContext.tsx";
import { SecretContext } from "../../context/SecretContext.tsx";
import { DebugContext } from "../../context/DebugContext.tsx";

import ModalBackground from '../../components/ModalBackground.tsx'
import RequestInfoModal from "../RequestInfoModal/RequestInfoModal.tsx";
import HistoryModal from '../HistoryModal/HistoryModal.tsx'
import SettingModal from '../SettingModal/SettingModal.tsx'

import { APIResponse } from "../../data/interface.tsx";

import Header from './Header.tsx'
import Footer from './Footer.tsx'
import InputField from './InputField.tsx'
import OutputField from './OutputField.tsx'

import VarEditorModal from "../VarEditorModal/VarEditorModal.tsx";
import DebugModal from "../DebugModal/DebugModal.tsx";
import { MemoryContext } from "../../context/MemoryContext.tsx";
import { EventContext } from "../../context/EventContext.tsx";
import { NOSESSION_KEY } from "../../data/constants.tsx";

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
        apiFetchWaiting,
        setApiFetchWaiting,
    } = memoryContext;
    const {
        enqueueApiRequest,
    } = eventContext;

    // Ctrl+Enter 핑
    useEffect(()=>{
        if (apiSubmitPing) {
            onSubmit();
            setApiSubmitPing(false);
        }
    }, [apiSubmitPing]);

    useEffect(()=>{
        let key = currentSession.chatIsolation ? currentSession.id : NOSESSION_KEY;
        
        setSubmitLoading(key in apiFetchWaiting);
    }, [currentSession, apiFetchWaiting])

    const onSubmit = () => {
        if (currentChat.input) {
            enqueueApiRequest({
                session:currentSession,
                input:currentChat.input,
                promptText:memoryContext.promptText
            })
            
            setApiFetchWaiting((waiting)=>{
                const newWaiting = {...waiting};
                const key = currentSession.chatIsolation ? currentSession.id : NOSESSION_KEY;
                newWaiting[key] = 1;
                return newWaiting;
            });
        }
        return new AbortController();
    }

    const loadHistory = (response:APIResponse) => {
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
                    text={currentChat.input ?? ""}
                    onChange={(value)=>onChanageInputField(value)}
                />
                <div className='seperate-section center undraggable'>
                    <SubmitButton
                        loading={submitLoading}
                        onSubmit={()=>onSubmit()}
                        onAbort={()=>{}}
                    />
                </div>
                <OutputField
                    className='right-section'
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
                </ModalBackground>
            }
        </div>
    )
}

interface SubmitButtonProps {
    loading:boolean,
    onSubmit:()=>void,
    onAbort:()=>void
}

function SubmitButton({loading, onSubmit, onAbort}:SubmitButtonProps) {

    return (
        <>
        {
            !loading && 
            <img 
                id='submit-button'
                src={ArrowIcon}
                draggable='false'
                onClick={(e)=>onSubmit()}
            />
        }
        {
            loading && 
            <img 
                className='rotate'
                src={LoadingIcon}
                draggable='false'
                onClick={(e)=>onAbort()}
            />
        }
        </>
    );
}

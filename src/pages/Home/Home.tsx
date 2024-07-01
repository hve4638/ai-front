import React, { useState, useEffect, useContext } from "react";
import ArrowIcon from '../../assets/icons/arrow.svg'
import LoadingIcon from '../../assets/icons/loading.svg'

import { requestPromptlist, requestPrompt } from "../../services/local.ts";

import { PromptContext } from "../../context/PromptContext.tsx";
import { StateContext } from "../../context/StateContext.tsx";
import { APIContext } from "../../context/APIContext.tsx";
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

import { CurlyBraceFormatParser } from "../../libs/curlyBraceFormat/index.ts";
import { AIModels } from "../../features/chatAI/index.ts";

export default function Home() {
    const [showSettingModal, setShowSettingModal] = useState(false);
    const [showModelConfigModal, setShowModelConfigModal] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
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

    useEffect(()=>{
        requestPromptlist()
        .then(data => {
            const prompts = data.prompts;
            promptContext.setPrompts(prompts);
            promptContext.setVars(data.vars);
            const {
                setPrompt,
                prompt1Key, prompt2Key,
                setPrompt1Key, setPrompt2Key
            } = stateContext;
            
            let initprompt = prompts.length > 0 ? prompts[0] : null;
            let p1IsValid = false;
            let p2IsValid = false;
            for (const item of prompts) {
                if (prompt1Key == item.key) {
                    p1IsValid = true;
                    initprompt = item;
        
                    if (item.list) {
                        for (const subitem of item.list) {
                            if (prompt2Key == subitem.value) {
                                p2IsValid = true;
                                initprompt = subitem;
                                break;
                            }
                        }
                        if (!p2IsValid && item.list.key > 0) {
                            setPrompt2Key(item.list[0].key);
                        }
                    }
                    break;
                }
            }
            if (!p1IsValid && prompts.length > 0) {
                setPrompt1Key(prompts[0].key);
            }
            
            if (initprompt != null) {
                setPrompt(initprompt);
            }
        });
    }, []);

    const onSubmit = () => {
        const { controller, promise } = AIModels.request(
            apiContext,
            {
                contents: textInput,
                note: stateContext.note,
                prompt: stateContext.promptContents
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

        return controller;
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
                        reversedVars : { input: 'describe yourself' }
                    }
                );
                console.log(text)
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
        <div className='fill column theme-dark' style={{position:'relative'}}>
            <Header
                onOpenHistory={()=>setShowHistoryModal(true)}
                onOpenModelConfig={()=>setShowModelConfigModal(true)}
                onOpenSetting={()=>setShowSettingModal(true)}
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
            <Footer/>
            {
                (showSettingModal || showModelConfigModal || showHistoryModal) &&
                <ModalBackground>
                {
                    showSettingModal &&
                    <SettingModal
                        onClose = {()=>setShowSettingModal(false)}
                    />
                }
                {
                    showModelConfigModal &&
                    <RequestInfoModal
                        onClose = {()=>setShowModelConfigModal(false)}
                    />
                }
                {
                    showHistoryModal &&
                    <HistoryModal
                        onClose = {()=>setShowHistoryModal(false)}
                        onClick = {(history)=>{
                            loadHistory(history);
                            setShowHistoryModal(false);
                        }}
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

import React, {memo, useContext, useEffect, useState} from 'react'

import { StoreContext } from 'context/StoreContext'
import { MemoryContext } from 'context/MemoryContext'

import ModalHeader from 'components/ModalHeader'
import { GoogleFontIconButton } from 'components/GoogleFontIcon'
import { AIModels } from 'features/chatAI'
import { useContextForce } from 'context'
import { CBFParseError } from 'libs/curlyBraceFormat/errors'

export default function RequestInfoModal({
    onClose
 }) {
    const storeContext = useContextForce(StoreContext);
    const memoryContext = useContextForce(MemoryContext);
    
    const [promptPreview, setPromptPreview] = useState(false);
    const [promptPreviewContents, setPromptPreviewContents] = useState<React.JSX.Element[]>([]);
    
    const {
        currentSession
    } = memoryContext;
    const promptText = memoryContext.promptMetadata.promptTemplate ?? '';

    useEffect(()=>{
        let results;
        try {
            results = parsePromptContent({promptContents:promptText, note:currentSession.note});
        }
        catch (e) {
            const error = e as CBFParseError; 
            setPromptPreviewContents([
                <div key="1" className="warning">Prompt Parse Failed</div>,
                <pre key="3">{error.message}</pre>,
            ]);
            return;
        }
        
        const newContents:React.JSX.Element[] = []
        let count = 0;
        for (const item of results) {
            newContents.push(
                <div style={{margin:'0px 4px 12px 4px', position:'relative'}} key={count++}>
                    <hr style={{width: '100%'}}/>
                    <div className='role undraggable' style={{position:'absolute', right: 8, top: 10 }}>
                        {item.role}
                    </div>
                </div>
            )
            newContents.push(<pre style={{marginBottom:"12px"}} key={count++}>{item.content}</pre>)
        }
        setPromptPreviewContents(newContents);
    }, [promptPreview]);

    useEffect(()=>{
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose();
                event.preventDefault();
            }
        }
        window.addEventListener('keydown', handleKeyDown);
    
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);
    
    return (
        <div id='requestinfo-modal' className='modal'>
            <ModalHeader
                name='Request 정보'
                onClose = {()=>{
                    onClose()
                }}
            />
            <div className='contents scrollbar'>
                <SubTitle className='row main-spacebetween'>
                    <span>프롬프트 템플릿</span>
                    <GoogleFontIconButton
                        className='preview-button'
                        value={promptPreview ? 'preview_off' : 'preview'}
                        onClick={()=>setPromptPreview(!promptPreview)}
                        selected={promptPreview}
                    />
                </SubTitle>
                {
                    !promptPreview && 
                    <div className='textbox fontstyle scrollbar'>
                    {
                        promptText.split('\n').map((value, index) => (
                            <pre key={index}>
                                {value == '' ? ' ' : value}
                            </pre>
                        ))
                    }
                    </div>
                }
                {
                    promptPreview && 
                    <div className='textbox preview scrollbar' style={{position:'relative'}}>
                    {
                        promptPreviewContents.map((value)=>(value))
                    }
                    </div>
                }
                <SubTitle>변수</SubTitle>
                <div className='textbox'>
                {
                    Object.entries(currentSession.note).map(([key, value]) => (
                        <div key={key} style={{marginBottom: '5px'}}>
                            {key} : {noteformat(value)}
                        </div>
                    ))
                }
                </div>
            </div>
        </div>
    )
}
const SubTitle = ({children, className=''}) => (
    <p className={`subtitle undraggable ${className}`}>{children}</p>
)

const noteformat = (value:any) => {
    if (typeof value == "string") {
        return value.replace(/\n/g, "\\n");
    }
    else {
        return JSON.stringify(value);
    }
}

const parsePromptContent = ({promptContents, note}) => {
    const interpretedPrompt = AIModels.interpretePrompt({
        contents : "<USER_INPUT_HERE>",
        note : note,
        prompt : promptContents,
        modelCategory : "NONE",
        modelName : "NONE",
    });

    return interpretedPrompt;
}
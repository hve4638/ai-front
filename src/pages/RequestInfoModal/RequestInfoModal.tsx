import React, {useContext, useEffect, useState} from 'react'

import { CurlyBraceFormatParser } from 'libs/curlyBraceFormat'

import { StoreContext } from 'context/StoreContext'
import { MemoryContext } from 'context/MemoryContext'

import ModalHeader from 'components/ModalHeader'
import { GoogleFontIconButton } from 'components/GoogleFontIcon'



export default function RequestInfoModal({
    onClose
 }) {
    const storeContext = useContext(StoreContext);
    const memoryContext = useContext(MemoryContext);
    if (!storeContext) throw new Error('<ModelConfig/> requiered StoreContextProvider');
    if (!memoryContext) throw new Error('<ModelConfig/> requiered MemoryContextProvider');
    
    const [promptPreview, setPromptPreview] = useState(false);
    const [promptPreviewContents, setPromptPreviewContents] = useState<React.JSX.Element[]>([]);
    
    const {
        promptText,
        currentSession
    } = memoryContext;

    useEffect(()=>{
        const results = parsePromptContent({promptContents:promptText, note:currentSession.note});
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
        return value;
    }
}

const parsePromptContent = ({promptContents, note}) => {
    const promptParser = new CurlyBraceFormatParser(promptContents);
    const contents:{content:string, role:string}[] = []

    promptParser.build({
        vars : { 
            ...note,
        },
        reservedVars : {
            input : "<USER_INPUT_HERE>",
        },
        role : (x:string) => x,
        map(text, role) {
            contents.push({
                role : role,
                content : text
            });
        }
    });
    return contents;
}
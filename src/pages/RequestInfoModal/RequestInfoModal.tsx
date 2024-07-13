import React, {useContext, useEffect, useState} from 'react'

import ModalHeader from '../../components/ModalHeader.tsx'

import { StoreContext } from '../../context/StoreContext.tsx';
import { CurlyBraceFormatParser } from '../../libs/curlyBraceFormat/index.ts';
import { MemoryContext } from '../../context/MemoryContext.tsx';

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
    }, [promptPreview])
    
    return (
        <div className='modal config-modal column'>
            <ModalHeader
                name='Request 정보'
                onClose = {()=>{
                    onClose()
                }}
            />
            <div className='column scrollbar' style={{ overflow:'auto'}}>
                <SubTitle className="row main-spacebetween">
                    <span>프롬프트 템플릿</span>
                    <span
                        className="material-symbols-outlined clickable noflex undraggable"
                        style={{fontSize:"1.5em", marginRight: "4px"}}
                        onClick={()=>setPromptPreview(!promptPreview)}
                    >
                        {promptPreview ? 'preview_off' : 'preview'}
                    </span>
                </SubTitle>
                {
                    !promptPreview && 
                    <div className='noflex textplace column scrollbar fontstyle' style={{position:'relative'}}>
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
                    <div className='preview noflex textplace column scrollbar' style={{position:'relative'}}>
                    {
                        promptPreviewContents.map((value)=>(value))
                    }
                    </div>
                }
                <SubTitle>변수</SubTitle>
                <div className='noflex textplace column'>
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
    <p className={`${className} noflex config-name undraggable`}>{children}</p>
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
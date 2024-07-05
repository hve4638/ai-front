import React, {useContext} from 'react'

import ModalHeader from '../../components/ModalHeader.tsx'

import { StateContext } from '../../context/StateContext.tsx';

export default function RequestInfoModal({
    onClose
 }) {
    const stateContext = useContext(StateContext);
    if (stateContext == null) {
        throw new Error('ModelConfig requiered StateContextProvider');
    }
    
    const { note, promptContents } = stateContext;
    
    return (
        <div className='modal config-modal column'>
            <ModalHeader
                name='Request 정보'
                onClose = {()=>{
                    onClose({})
                }}
            />
            <div className='column scrollbar' style={{ overflow:'auto'}}>
                <SubTitle>프롬프트 템플릿</SubTitle>
                <div className='noflex textplace column scrollbar' style={{position:'relative'}}>
                {
                    promptContents.split('\n').map((value, index) => (
                        <pre key={index} className='fontstyle'>
                            {value == '' ? ' ' : value}
                        </pre>
                    ))
                }
                </div>
                <SubTitle>Note</SubTitle>
                <div className='noflex textplace column'>
                    {
                        Object.entries(note).map(([key, value]) => (
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

const SubTitle = ({children}) => (
    <p className='noflex config-name undraggable'>{children}</p>
)

const noteformat = (value:any) => {
    if (typeof value == "string") {
        return value.replace(/\n/g, "\\n");
    }
    else {
        return value;
    }
}
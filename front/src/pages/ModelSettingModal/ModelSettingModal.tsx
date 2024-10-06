import React, { useState, useContext, useRef, useEffect } from 'react'

import { AIModels, MODELS } from 'features/chatAI'
import { MemoryContext, SecretContext } from 'context'

import ModalHeader from 'components/ModalHeader'
import { PopUpMenu } from 'components/PopUpMenu'

import { CommonOptions } from './options/CommonOptions'
import { GeminiOptions } from './options/GeminiOptions'
import { GPTOptions } from './options/GPTOptions'
import { ClaudeOptions } from './options/ClaudeOptions'
import { GoogleVertexAIOptions } from './options/GoogleVertexAIOptions'

interface ModelSettingModalProps {
    onClose:()=>void
}

export function ModelSettingModal(props:ModelSettingModalProps) {
    const memoryContext = useContext(MemoryContext);
    const secretContext = useContext(SecretContext);
    if (!secretContext) throw new Error('ModelSettingModal required SecretContextProvider');
    if (!memoryContext) throw new Error('ModelSettingModal required MemoryContextProvider');
    
    const {
        currentSession
    } = memoryContext;

    const modalRef:any = useRef(null);
    const [categories, setCategories] = useState(AIModels.getCategories());
    const [selectedCategory, setSelectedCategory] = useState(currentSession.modelCategory);

    const [size, setWidth] = useState({width:0, height:0});

    const [modelOptions, setModelOptions] = useState(secretContext.modelInfo.modelOptions);
    const [selectedCategoryName, setSelectedCategoryName] = useState('');
    const [isPopupCategories, setIsPopupCategories] = useState(false);

    const modelOption = modelOptions[selectedCategory] ?? {}
    const setModelOption = (data: { [key: string]: any }) => {
        const newOptions = {...modelOptions}
        newOptions[selectedCategory] = data;
        setModelOptions(newOptions);
    }

    const onClose = ()=>{
        const newModelInfo = {
            category : selectedCategory,
            model : "",
            modelOptions : modelOptions
        }
        secretContext.setModelInfo(newModelInfo);

        props.onClose();
    }

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
    }, [props.onClose]);
    
    useEffect(()=>{
        if (modalRef.current) {
            const width = modalRef.current.offsetWidth;
            const height = modalRef.current.offsetHeight;
            setWidth({ width, height });
        }

        if (selectedCategory == null) {
            const category = selectedCategory ?? categories[0].value;
            const models = AIModels.getModels(category);
            
            setSelectedCategory(category);
        }
    }, []);
    useEffect(()=>{
        for (const item of categories) {
            if (item.value == selectedCategory) {
                setSelectedCategoryName(item.name);
                break;
            }
        }
    }, [ selectedCategory ]);

    return (
        <div
            id='setting-modal'
            className='modal undraggable column'
            ref = {modalRef}
        >
            {
                isPopupCategories &&
                <PopUpMenu
                    title='공급자'
                    item={categories}
                    onClick={(value)=>{
                        setSelectedCategory(value);
                        setIsPopupCategories(false);
                    }}
                    style={{
                        top : "0px",
                        left : `${size.width+10}px`
                    }}
                    onClickOutside={()=>setIsPopupCategories(false)}
                />
            }
            <ModalHeader
                name='모델 설정'
                onClose = {()=>onClose()}
            />
            <div className='item column'>
                <p>모델</p>
                <button onClick={()=>setIsPopupCategories(true)}>{selectedCategoryName}</button>
            </div>
            {
                selectedCategory == MODELS.GOOGLE_GEMINI &&
                <GeminiOptions
                    option={modelOption}
                    setOption={(data)=>setModelOption(data)}
                />
            }
            {
                selectedCategory == MODELS.CLAUDE &&
                <ClaudeOptions
                    option={modelOption}
                    setOption={(data)=>setModelOption(data)}
                />
            }
            {
                selectedCategory == MODELS.OPENAI_GPT &&
                <GPTOptions
                    option={modelOption}
                    setOption={(data)=>setModelOption(data)}
                />
            }
            {
                selectedCategory == MODELS.GOOGLE_VERTEXAI &&
                <GoogleVertexAIOptions
                    option={modelOption}
                    setOption={(data)=>setModelOption(data)}
                />
            }
            <div style={{height:'16px'}}/>
            <CommonOptions
                option={modelOption}
                setOption={(data)=>setModelOption(data)}
            />
            <div style={{height:'16px'}}/>
        </div>
    )
}
import React, { useState, useContext, useRef, useEffect } from 'react'
import { SecretContext } from '../../context/SecretContext.tsx'
import ModalHeader from '../../components/ModalHeader.tsx'
import { PopUpMenu } from '../../components/PopUpMenu.tsx'
import { AIModels, MODELS } from '../../features/chatAI/index.ts'
import { ButtonFull, InputFull, InputSmall, SelectFull } from './Forms.tsx'
import { CommonOptions } from './options/CommonOptions.tsx'
import { GeminiOptions } from './options/GeminiOptions.tsx'
import { GPTOptions } from './options/GPTOptions.tsx'
import { ClaudeOptions } from './options/ClaudeOptions.tsx'
import { GoogleVertexAIOptions } from './options/GoogleVertexAIOptions.tsx'

interface SettingModalProps {
    onClose:()=>void
}

function SettingModal(props:SettingModalProps) {
    const secretContext = useContext(SecretContext);
    if (secretContext == null) {
        throw new Error('SettingModel required SecretContextProvider')
    }
    
    const modalRef:any = useRef(null);
    const [size, setWidth] = useState({width:0, height:0});

    const [categories, setCategories] = useState(AIModels.getCategories());
    const [models, setModels] = useState<{name:string,value:string}[]|null>(null);

    const [topp, setTopp] = useState(secretContext.topp);
    const [temperature, setTemperature] = useState(secretContext.temperature);
    const [maxtoken, setMaxtoken] = useState(secretContext.maxtoken);

    const [modelOptions, setModelOptions] = useState(secretContext.modelInfo.modelOptions);
    const [selectedCategory, setSelectedCategory] = useState(secretContext.modelInfo.category);
    const [selectedCategoryName, setSelectedCategoryName] = useState('');
    const [selectedModel, setSelectedModel] = useState(secretContext.modelInfo.model);
    const [selectedModelName, setSelectedModelName] = useState('');

    const [isPopupCategories, setIsPopupCategories] = useState(false);
    const [isPopupModel, setIsPopupModels] = useState(false);

    const modelOption = modelOptions[selectedCategory] ?? {}
    const setModelOption = (data: { [key: string]: any }) => {
        const newOptions = {...modelOptions}
        newOptions[selectedCategory] = data;
        setModelOptions(newOptions);
    }

    const onClose = ()=>{
        const newModelInfo = {
            category : selectedCategory,
            model : selectedModel,
            modelOptions : modelOptions
        }
        secretContext.setModelInfo(newModelInfo);
        secretContext.setMaxtoken(maxtoken);
        secretContext.setTemperature(temperature);
        secretContext.setTopp(topp);

        props.onClose();
    }
    
    useEffect(()=>{
        if (modalRef.current) {
            const width = modalRef.current.offsetWidth;
            const height = modalRef.current.offsetHeight;
            setWidth({ width, height });
        }

        if (selectedCategory == null || selectedModel == null) {
            const category = selectedCategory ?? categories[0].value;
            const models = AIModels.getModels(category);
            const model = models[0].value;
            
            setModels(models);
            setSelectedCategory(category);
            setSelectedModel(model);
        }
    }, []);
    useEffect(()=>{
        for (const item of categories) {
            if (item.value == selectedCategory) {
                const newModels = AIModels.getModels(item.value);

                setSelectedCategoryName(item.name);
                setModels(newModels);
                break;
            }
        }
    }, [ selectedCategory ]);
    useEffect(()=>{
        if (models == null || models.length == 0) {
            setModels(AIModels.getModels(selectedCategory))
        }
        else {
            let found = false;
            for (const item of models) {
                if (item.value === selectedModel) {
                    setSelectedModelName(item.name);
                    found = true;
                    break;
                }
            }

            if (!found) {
                setSelectedModel(models[0].value);
                setSelectedModelName(models[0].name);
            }
        }
    }, [ selectedModel, models ]);

    return (
        <div
            className='modal setting-container undraggable column'
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
            {
                isPopupModel &&
                <PopUpMenu
                    title='모델'
                    item={models ?? []}
                    onClick={(value)=>{
                        setSelectedModel(value);
                        setIsPopupModels(false);
                    }}
                    style={{
                        top : "0px",
                        left : `${size.width+10}px`
                    }}
                    onClickOutside={()=>setIsPopupModels(false)}
                />
            }
            <ModalHeader
                name='설정'
                onClose = {()=>onClose()}
            />
            <div style={{height:'4px'}}/>
            <SelectFull
                name='모델'
                value={selectedCategoryName}
                onClick={()=>setIsPopupCategories(true)}
            />
            <SelectFull
                name={null}
                value={selectedModelName}
                onClick={()=>setIsPopupModels(true)}
            />
            <div style={{height:'4px'}}/>
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
                value = {{
                    maxtoken, setMaxtoken,
                    temperature, setTemperature,
                    topp, setTopp
                }}
            />
        </div>
    )
}

export default SettingModal;
import React, { useContext, useEffect, useState } from "react";

import { Note } from 'data/interface';

import {
    StoreContext,
    MemoryContext,
    EventContext,
    useContextForce,
} from "context";
import { ChatSession } from 'context/interface';

import { AIModels, MODELS } from 'features/chatAI';

import Dropdown from 'components/Dropdown';
import { GoogleFontIconButton } from 'components/GoogleFontIcon';
import { LayerDropdown } from 'components/LayerDropdown';
import { AnthropicIcon, GoogleIcon, OpenAIIcon, GoogleVertexAIIcon } from 'components/Icons'
import { IPromptMetadata, PromptMetadataSublist } from "features/prompts";

interface HeaderProps {
    onOpenSetting: () => void,
    onOpenHistory: () => void,
    onOpenModelSetting: () => void,
    onOpenRequestInfo: () => void,
    onOpenVarEditor: () => void,
    onOpenErrorLog: () => void,
}

export default function Header(props: HeaderProps) {
    const storeContext = useContextForce(StoreContext);
    const memoryContext = useContextForce(MemoryContext);
    const eventContext = useContextForce(EventContext);

    const [dropdownItem, setDropdownItem] = useState<any>([]);
    const [promptIndexes, setPromptIndexes] = useState<[number,number|null]>([-1, null]);
    const [promptMetadataSublist, setPromptMetadataSublist] = useState<PromptMetadataSublist|null>(null);

    const {
        currentSession,
        setCurrentSession
    } = memoryContext;
    
    useEffect(() => {
        const indexes = memoryContext.promptMetadata.indexes;

        if (indexes[1] === null) {
            setPromptMetadataSublist(null);
        }
        else {
            const sublist = memoryContext.promptMetadataTree.list[indexes[0]] as PromptMetadataSublist;

            setPromptMetadataSublist(sublist);
        }

        setPromptIndexes(indexes);
    }, [ memoryContext.promptMetadata ]);

    useEffect(() => {
        const dropdownItems: any[] = [];
        for (const category of AIModels.getCategories()) {
            const categorylist: any[] = [];
            const categorydata = {
                name: (
                    <span className='center'>
                        {
                            category.value === MODELS.GOOGLE_GEMINI &&
                            <GoogleIcon style={{ marginRight: '8px' }} />
                        }
                        {
                            category.value === MODELS.GOOGLE_VERTEXAI &&
                            <GoogleVertexAIIcon style={{ marginRight: '8px' }} />
                        }
                        {
                            category.value === MODELS.OPENAI_GPT &&
                            <OpenAIIcon style={{ marginRight: '8px' }} />
                        }
                        {
                            category.value === MODELS.CLAUDE &&
                            <AnthropicIcon style={{ marginRight: '8px' }} />
                        }
                        <span>{category.name}</span>
                    </span>
                ),
                list: categorylist,
            }
            dropdownItems.push(categorydata);

            for (const model of AIModels.getModels(category.value)) {
                const modeldata = {
                    name: model.name,
                    value: {
                        modelCategory: category.value,
                        modelName: model.value,
                    }
                }
                categorylist.push(modeldata);
            }
        }
        setDropdownItem(dropdownItems);
    }, []);

    const onChangePromptMetadata = (target: IPromptMetadata | PromptMetadataSublist) => {
        let metadata: IPromptMetadata;
        if (target instanceof PromptMetadataSublist) {
            metadata = target.firstPromptMetadata();
        }
        else {
            metadata = target;
        }

        eventContext.setCurrentPromptMetadata(metadata);
    }

    const onModelChange = (item: { modelCategory: string, modelName: string }) => {
        const newSession = {
            ...currentSession,
            modelCategory: item.modelCategory,
            modelName: item.modelName,
        }
        setCurrentSession(newSession);
    }

    return (
        <header id="app-header">
            <div className='expanded row'>
                <LayerDropdown
                    className='responsive model-provider'
                    itemClassName='responsive model-provider'
                    value={currentSession}
                    items={dropdownItem}
                    onChange={(item) => onModelChange(item)}
                    onCompare={(a, b) => a.modelCategory === b.modelCategory && a.modelName === b.modelName}
                >
                    {
                        currentSession.modelCategory === MODELS.GOOGLE_GEMINI &&
                        <GoogleIcon style={{ marginRight: '8px' }} />
                    }
                    {
                        currentSession.modelCategory === MODELS.GOOGLE_VERTEXAI &&
                        <GoogleVertexAIIcon style={{ marginRight: '8px' }} />
                    }
                    {
                        currentSession.modelCategory === MODELS.OPENAI_GPT &&
                        <OpenAIIcon style={{ marginRight: '8px' }} />
                    }
                    {
                        currentSession.modelCategory === MODELS.CLAUDE &&
                        <AnthropicIcon style={{ marginRight: '8px' }} />
                    }
                </LayerDropdown>
                <GoogleFontIconButton
                    onClick={props.onOpenModelSetting}
                    className='small-icon rotate-90deg'
                    value="discover_tune"
                />
                <div className='flex' />
                <>
                    <div className="dropdown-pad" />
                    <PromptMetadataDropdown
                        value={promptIndexes[0]}
                        items={memoryContext.promptMetadataTree.list}
                        onChange={(item) => onChangePromptMetadata(item)}
                    />
                </>
                {
                    promptMetadataSublist !== null &&
                    <>
                        <div className="dropdown-pad" />
                        <PromptMetadataDropdown
                            value={promptIndexes[1] as number}
                            items={promptMetadataSublist.list}
                            onChange={(item) => onChangePromptMetadata(item)}
                        />
                    </>
                }
            </div>
            <div className='seperate-section'/>
            <div className='expanded row'>
                <div className='largewidth-only'>
                    {
                        (memoryContext.currentPromptMetadata.showInHeaderVars?.length ?? 0) !== 0 &&
                        memoryContext.currentPromptMetadata.showInHeaderVars.map((item, index) => { 
                            const value = (item.name in currentSession.note) ? currentSession.note[item.name] : null;
                            return (
                                <Dropdown
                                    key={index}
                                    // @ts-ignore
                                    items={item.options}
                                    value={value}
                                    style={{ marginRight: "8px" }}
                                    onChange={(value: string) => {
                                        eventContext.setCurrentPromptMetadataVar(item.name, value);
                                    }}
                                    titleMapper={dropdownValueFinder}
                                />
                            )
                        })
                    }
                </div>
                <div className='flex'></div>
                {
                    memoryContext.currentPromptMetadata.vars.length !== 0 &&
                    <>
                        <GoogleFontIconButton
                            value="edit_note"
                            onClick={props.onOpenVarEditor}
                        />
                        <div className='pad'/>
                    </>
                }
                {
                    memoryContext.errorLogs.length !== 0 &&
                    <>
                        <div className='small-pad'/>
                        <GoogleFontIconButton
                            value="error"
                            onClick={props.onOpenErrorLog}
                        />
                    </>
                }
                <div className='small-pad'/>
                <GoogleFontIconButton
                    value="history"
                    onClick={props.onOpenHistory}
                />
                <div className='small-pad'/>
                <GoogleFontIconButton
                    value="dns"
                    onClick={props.onOpenRequestInfo}
                />
                <div className='small-pad'/>
                <GoogleFontIconButton
                    value="settings"
                    onClick={props.onOpenSetting}
                />
            </div>
        </header>
    )
}

type PromptMetadataDropdownProps = {
    value:number;
    items:(IPromptMetadata|PromptMetadataSublist)[];
    onChange:(item:any)=>void;
}

function PromptMetadataDropdown({ value, items, onChange }:PromptMetadataDropdownProps) {
    return (
        <Dropdown
            className='responsive'
            itemClassName='responsive'
            value={value}
            items={
                [
                    ...items.map(
                        (item, index) => {
                            return { name: item.name, value: item, index: index }
                        }
                    )

                ]
            }
            onChange={(item) => onChange(item)}
            titleMapper={dropdownIndexFinder}
        />  
    );
}

const HeaderIcon = ({ src, onClick }) => (
    // HeaderIcon에 사용되는 src 크기는 40x40
    <div className='undraggable' style={{ marginLeft: '15px' }}>
        <img
            className='clickable-animation' src={src}
            onClick={(e) => onClick()}
        />
    </div>
)

const IconButton = ({ value, style, onClick }) => {
    return (
        <div
            className='center icon-button-container undraggable'
            style={style}
            onClick={onClick}
        >
            <span className="material-symbols-outlined button-theme-change icon-clickable-animation">
                {value}
            </span>
        </div>
    );
}

const dropdownIndexFinder = (value, items) => {
    for (const item of items) {
        if (value === item.index) {
            return item.name;
        }
    }
}
const dropdownkeyFinder = (value, items) => {
    for (const item of items) {
        if (value === item.key) {
            return item.name;
        }
    }
}

const dropdownValueFinder = (value, items) => {
    for (const item of items) {
        if (value === item.value) {
            return item.name;
        }
    }
}


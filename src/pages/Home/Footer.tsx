import React, { useContext, useState } from 'react'
import { GITHUB_LINK, TARGET_ENV } from '../../data/constants.tsx';
import GithubIcon from '../../assets/icons/github.png'

import { StateContext } from "../../context/StateContext.tsx";

import { Slot, SlotAdder } from './Slot.tsx';

import { DebugContext } from '../../context/DebugContext.tsx';
import { openBrowser, openPromptFolder } from '../../services/local/index.ts';
import { HoverTooltip } from '../../components/HoverTooltip.tsx';
import { PromptContext } from '../../context/PromptContext.tsx';

interface FooterProps {
    onOpenDebug:()=>void
}

export default function Footer({ onOpenDebug }:FooterProps) {
    const promptContext = useContext(PromptContext);
    const stateContext = useContext(StateContext);
    const debugContext = useContext(DebugContext);
    if (promptContext == null) {
        throw new Error('Footer must be used in StateContextProvider');
    }
    if (stateContext == null) {
        throw new Error('Footer must be used in StateContextProvider');
    }
    if (debugContext == null) {
        throw new Error('Footer must be used in DebugContextProvider');
    }
    const {
        promptSlots, setPromptSlots,
        markdownMode, setMarkdownMode,
        lineByLineMode, setLineByLineMode
    } = stateContext;
    const {
        promptList
    } = promptContext;

    const createSlotData = () => {
        return {
            prompt1 : stateContext.prompt1Key,
            prompt2 : stateContext.prompt2Key,
            note: stateContext.note,
            extra: {
                markdown : markdownMode
            }
        }
    }
    const applySlotData = (slot) => {
        const newPrompt = promptList.getPrompt(slot.prompt1, slot.prompt2);
        stateContext.setPrompt1Key(slot.prompt1);
        stateContext.setPrompt2Key(slot.prompt2);
        stateContext.setPrompt(newPrompt);
        stateContext.setNote(slot.note);
        stateContext.setMarkdownMode(slot.extra?.markdown ?? true);
    }

    return (
    <footer className='noflex row'>
        <div className='left-section'>
            <div className='noflex footer-icon undraggable' style={{ height: '35px' }}>
                <img
                    alt='github-icon'
                    className='clickable-animation'
                    src={GithubIcon}
                    onClick={()=> openBrowser(GITHUB_LINK)}
                />
            </div>
            <div className='flex prompt-slots-container row-reverse undraggable'>
                <SlotAdder
                    onClick={()=>{
                        const data = createSlotData();
                        const newSlots = [...promptSlots, data];
                        setPromptSlots(newSlots);
                    }}
                />
                {
                    promptSlots != null &&
                    [...promptSlots].reverse().map((value, index) => (
                        <Slot
                            key={index}
                            value={value}
                            index={promptSlots.length - index}
                            onClick={()=>{
                                applySlotData(value);
                            }}
                            onEdit={()=>{
                                const newSlot = [...promptSlots].reverse();
                                newSlot[index] = createSlotData();
                                setPromptSlots(newSlot.reverse());
                            }}
                            onDelete={()=>{
                                const newSlot = [...promptSlots].reverse();
                                newSlot.splice(index, 1);
                                setPromptSlots(newSlot.reverse());
                            }}
                        />
                    ))
                }
            </div>
        </div>
        <div className='seprate-section'>
        </div>
        <div className='right-section'>
            <div style={{width:'16px'}}/>
            <HoverTooltip
                text="마크다운"
            >
                <IconButton
                    value='markdown'
                    enabled={markdownMode}
                    size={30}
                    onClick={()=>setMarkdownMode(!markdownMode)}
                />
            </HoverTooltip>
            <Pad/>
            <HoverTooltip
                text="XML (실험적)"
            >
                <IconButton
                    value='code'
                    enabled={lineByLineMode}
                    size={30}
                    onClick={()=>setLineByLineMode(!lineByLineMode)}
                />
            </HoverTooltip>
            <div className='flex'></div>
            {
                debugContext.isDebugMode &&      
                <IconButton
                    value='screen_share'
                    enabled={debugContext.mirror}
                    size={30}
                    onClick={()=>debugContext.setMirror(!debugContext.mirror)}
                />
            }
            <Pad/>
            {
                debugContext.isDebugMode &&
                <IconButton
                    value='labs'
                    size={30}
                    onClick={()=>onOpenDebug()}
                />
            }
            {
                TARGET_ENV !== "WEB" &&
                <>
                    <Pad/>
                    <IconButton
                        value='folder_open'
                        size={30}
                        onClick={()=>openPromptFolder()}
                    />
                </>
            }
            <div style={{width:'16px'}}/>
        </div>
    </footer>
    );
}

const Pad = () => (<div style={{width:'8px'}}/>)

interface IconButtonProps {
    className?:string;
    value:string;
    size:number;
    enabled?:boolean;
    onClick:()=>void;
}
function IconButton({
    className='', value, size, enabled=false, onClick
}:IconButtonProps) {
    const pxsize = `${size}px`;
    return (
        <label
            className={`${className} span-button-container undraggable center`}
            style={{ color: 'white', fontSize: pxsize, width: pxsize, height: pxsize }}
            onClick={(e)=>onClick()}
        >
            <span className={`${enabled ? 'selected' : ''} material-symbols-outlined span-button`}>
                {value}
            </span>
        </label>
    )
}

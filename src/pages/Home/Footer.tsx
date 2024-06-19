import React, { useContext, useEffect, useState } from 'react'
import { GITHUB_LINK } from '../../data/constants.tsx';
import GithubIcon from '../../assets/icons/github.png'

import { StateContext } from "../../context/StateContext.tsx";
import { Checkbox } from "../../components/Checkbox.tsx";

import { Slot, SlotAdder } from './Slot.tsx';

import { DebugContext } from '../../context/DebugContext.tsx';

export default function Footer() {
    const stateContext = useContext(StateContext);
    const debugContext = useContext(DebugContext);
    if (stateContext == null) {
        throw new Error('Footer must be used in StateContextProvider');
    }
    if (debugContext == null) {
        throw new Error('Footer must be used in DebugContextProvider');
    }
    const {
        promptSlots, setPromptSlots,
        markdownMode, setMarkdownMode
    } = stateContext;

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
        stateContext.setPrompt1Key(slot.prompt1);
        stateContext.setPrompt2Key(slot.prompt2);
        stateContext.setNote(slot.note);
        stateContext.setMarkdownMode(slot.extra?.markdown ?? true);
    }

    return (
    <footer className='noflex row'>
        <div className='left-section'>
            <div className='noflex footer-icon undraggable' style={{ height: '35px' }}>
                <img
                    className='clickable-animation'
                    src={GithubIcon}
                    onClick={()=> window.open(GITHUB_LINK)}
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
            <IconButton
                value='markdown'
                enabled={markdownMode}
                size={30}
                onClick={()=>setMarkdownMode(!markdownMode)}
            />
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
        </div>
    </footer>
    );
}

interface IconButtonProps {
    className?:string;
    value:string;
    size:number;
    enabled:boolean;
    onClick:()=>void;
}
function IconButton({
    className='', value, size, enabled, onClick
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
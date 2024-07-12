import React, {memo, useContext, useEffect, useState} from "react";

import HistoryIcon from '../../assets/icons/history.svg'
import AdvancedIcon from '../../assets/icons/model.svg'
import SettingIcon from '../../assets/icons/setting.svg'
import NoteIcon from '../../assets/icons/note.svg'

import { PromptContext } from "../../context/PromptContext.tsx";
import { StoreContext } from "../../context/StoreContext.tsx";

import Dropdown from "../../components/Dropdown.tsx";
import { PromptInfomation } from "../../features/prompts/promptInfomation.ts";
import { TARGET_ENV } from "../../data/constants.tsx";
import { PromptSublist } from "../../features/prompts/promptSublist.ts";
import { Note } from "../../data/interface.ts";
import { MemoryContext } from "../../context/MemoryContext.tsx";
import { ChatSession } from "../../context/interface.ts";

interface HeaderProps {
  onOpenSetting : () => void,
  onOpenHistory : () => void,
  onOpenModelConfig : () => void,
  onOpenVarEditor : () => void,
}

export default function Header(props:HeaderProps) {
    const promptContext = useContext(PromptContext);
    const storeContext = useContext(StoreContext);
    const memoryContext = useContext(MemoryContext);
    if (!promptContext) throw new Error('Header must be used in PromptContextProvider');
    if (!storeContext) throw new Error('Header must be used in StoreContextProvider');
    if (!memoryContext) throw new Error('Header must be used in StoreContextProvider');
    
    const {
      promptList
    } = promptContext;
    const {
      promptSubList,
      promptIndex,
      promptInfomation,
      currentSession,
      setCurrentSession
    } = memoryContext;

    const onChangePromptKey = (target:PromptInfomation|PromptSublist) => {
      let pl:PromptInfomation;
      if (target instanceof PromptSublist) {
        pl = target.firstPrompt();
      }
      else {
        pl = target;
      }

      const newSession:ChatSession = {
        ...currentSession,
        promptKey: pl.key,
        note: getNewNote(pl, currentSession.note)
      }
      setCurrentSession(newSession);
    }

    const getNewNote = (promptinfo:PromptInfomation, note:Note) => {
      const newNote = {};
      for (const item of promptinfo.allVars) {
        let value: string;
        if (note != null && item.name in note) {
          value = note[item.name];
        }
        else {
          value = item.default_value;
        }
        newNote[item.name] = value;
      }
      
      return newNote;
    }

    return (
        <header className='noflex row'>
          <div className='left-section row' style={{padding:'0px 32px 0px 0px'}}>
            {
              TARGET_ENV === "WEB" &&
              <a className='undraggable' href={window.location.href}>AI Front</a>
            }
            {
              TARGET_ENV !== "WEB" &&
              <div className='undraggable' style={{position:"relative"}}>
                AI Front
              </div>
            }
            {
                // @TODO: 밝은 테마 추가하기
                false &&
                <IconButton
                value='contrast'
                style={{fontSize:'32px', margin: '0px 8px 0px 8px'}}
                onClick={()=>{}}
                />
            }
            <div className='flex'></div>
            <Dropdown
              style={{marginLeft :'15px', minWidth:'100px'}}
              value={ promptIndex[0] }
              items={[...promptList.list.map((item, index)=>{return {name:item.name, value:item, index:index}})]}
              onChange={(item)=>onChangePromptKey((item))}
              titleMapper={dropdownIndexFinder}
            />
            {
              promptSubList != null &&
              <Dropdown
                style={{ marginLeft :'15px' }}
                value={ promptIndex[1] }
                items={[...promptSubList.list.map((item, index)=>{return {name:item.name, value:item, index:index}})]}
                onChange={(item)=>onChangePromptKey((item))}
                titleMapper={dropdownIndexFinder}
              />
            }
          </div>
          <div className='seprate-section'>
          </div>
          <div className='right-section row'>
            {
                (promptInfomation.headerExposuredVars?.length ?? 0) !== 0 &&
                promptInfomation.headerExposuredVars.map((item, index) => {
                  const value = (item.name in currentSession.note) ? currentSession.note[item.name] : null;
                  return (
                    <Dropdown
                      key={index}
                      items={item.options}
                      value={value}
                      style={{marginRight:"8px"}}
                      onChange={(value:string)=>{
                        const newSession = {...currentSession};
                        const newNote = {...currentSession.note};
                        newNote[item.name] = value;
                        newSession.note = newNote;

                        setCurrentSession(newSession);
                      }}
                      titleMapper={dropdownValueFinder}
                    />
                  )
                })
            }
            
            <div style={{width:'10px'}}></div>
            <div className='flex'></div>
            {
              (promptInfomation?.allVars?.length ?? 0) !== 0 &&
              <HeaderIcon
                src={NoteIcon}
                onClick={props.onOpenVarEditor}
              />
            }
            <div style={{width:'10px'}}></div>
            <HeaderIcon
              src={HistoryIcon}
              onClick={props.onOpenHistory}
            />
            <HeaderIcon
              src={AdvancedIcon}
              onClick={props.onOpenModelConfig}
            />
            <HeaderIcon
              src={SettingIcon}
              onClick={props.onOpenSetting}
            />
          </div>
        </header>
    )
}


const HeaderIcon = ({src, onClick}) => (
    // HeaderIcon에 사용되는 src 크기는 40x40
    <div className='undraggable' style={{ marginLeft: '15px' }}>
      <img
        className='clickable-animation' src={src}
        onClick={(e)=>onClick()}
      />
    </div>
)

const IconButton = ({value, style, onClick}) => {
    return (
      <div
        className='center icon-button-container undraggable'
        style={style}
        onClick= {onClick}
      >
        <span className="material-symbols-outlined button-theme-change icon-clickable-animation">
          {value}
        </span>
      </div>
    );
}

const dropdownIndexFinder = (value, items) => {
  for (const item of items) {
    if (value == item.index) {
      return item.name;
    }
  }
}
const dropdownkeyFinder = (value, items) => {
  for (const item of items) {
    if (value == item.key) {
      return item.name;
    }
  }
}

const dropdownValueFinder = (value, items) => {
  for (const item of items) {
    if (value == item.value) {
      return item.name;
    }
  }
}


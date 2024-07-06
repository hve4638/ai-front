import React, {useContext, useEffect, useState} from "react";

import HistoryIcon from '../../assets/icons/history.svg'
import AdvancedIcon from '../../assets/icons/model.svg'
import SettingIcon from '../../assets/icons/setting.svg'
import NoteIcon from '../../assets/icons/note.svg'

import { requestPrompt } from "../../services/local.ts";

import { SubPromptsType } from "../../context/interface/promptInterface.tsx";
import { PromptContext } from "../../context/PromptContext.tsx";
import { StateContext } from "../../context/StateContext.tsx";

import Dropdown from "../../components/Dropdown.tsx";
import { PromptInfomation } from "../../features/prompts/promptInfomation.ts";
import { IPromptInfomation } from "../../features/prompts/interface.ts";

interface HeaderProps {
  onOpenSetting : () => void,
  onOpenHistory : () => void,
  onOpenModelConfig : () => void,
  onOpenVarEditor : () => void,
}

export default function Header(props:HeaderProps) {
    const promptContext = useContext(PromptContext);
    const stateContext = useContext(StateContext);
    const [subPrompts, setSubPrompts] = useState<IPromptInfomation[]>([]);
    
    if (!promptContext) throw new Error('Header must be used in PromptContextProvider');
    if (!stateContext) throw new Error('Header must be used in StateContextProvider');

    const {
      promptList
    } = promptContext;
    const {
      setPromptContents,
      note, setNote,
      prompt, setPrompt,
      prompt1Key, prompt2Key,
      setPrompt1Key, setPrompt2Key
    } = stateContext;

    useEffect(()=>{
      if (prompt1Key == null) return;

      const item = promptList.getPrompt(prompt1Key);
      if (item == null) return;

      setSubPrompts(item.list ?? []);
    }, [promptList, prompt1Key]);

    useEffect(()=>{
      if (prompt == null) return;

      setNewNotes(prompt);
      
      requestPrompt(prompt.value)
      .then(data => setPromptContents(data));
    }, [prompt])

    const onSelectPrompt1 = (item:PromptInfomation) => {
      let autoselected;
      if (item.value != null) {
        autoselected = item;
      }
      else if (item.list != null) {
        autoselected = item.list[0];
      }
      else {
        throw new Error(`Invalid prompts Format : ${item.name}`)
      }
      setPrompt(autoselected);
    }
    const onSelectPrompt2 = (item: SubPromptsType) => {
      setPrompt(item);
    }

    const setNewNotes = (promptinfo:PromptInfomation) => {
      const newNotes = {};
      for (const item of promptinfo.allVars) {
        let value: string;
        if (note != null && item.name in note) {
          value = note[item.name];
        }
        else {
          value = item.default_value;
        }
        newNotes[item.name] = value;
      }
      
      setNote(newNotes);
    }

    return (
        <header className='noflex row'>
          <div className='left-section row' style={{padding:'0px 32px 0px 0px'}}>
            <a
            className='undraggable'
            href={window.location.href}
            >AI Front</a>
            {
                // TODO: 밝은 테마 추가하기
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
              value={prompt1Key}
              items={[...promptList.list.map((item)=>{return {name:item.name, value:item, key:item.key}})]}
              onChange={(item)=>{
                setPrompt1Key(item.key);
                onSelectPrompt1(item);
                
                if (item.list == null) {
                  // nothing to do
                }
                else if (prompt2Key == null || promptList.getPrompt(item.key, prompt2Key) == null) {
                  setPrompt2Key(item.list[0].key);
                }
              }}
              titleMapper={dropdownkeyFinder}
            />
            {
              subPrompts.length != 0 &&
              <Dropdown
                style={{marginLeft :'15px'}}
                value={prompt2Key}
                items={[...subPrompts.map((item, index)=>{return {name:item.name, value:item, key:item.key}})]}
                onChange={(item)=>{
                  setPrompt2Key(item.key);
                  onSelectPrompt2(item);
                }}
                titleMapper={dropdownkeyFinder}
              />
            }
          </div>
          <div className='seprate-section'>
          </div>
          <div className='right-section row'>
            {
                (prompt?.headerExposuredVars?.length ?? 0) !== 0 &&
                prompt.headerExposuredVars.map((item, index) => {
                  const value = (item.name in (note ?? {})) ? note[item.name] : null;
                  return (
                    <Dropdown
                      key={index}
                      items={item.options}
                      value={value}
                      style={{marginRight:"8px"}}
                      onChange={(value:string)=>{
                        const newNote = {...note};
                        newNote[item.name] = value;
                        setNote(newNote);
                      }}
                      titleMapper={dropdownValueFinder}
                    />
                  )
                })
            }
            
            <div style={{width:'10px'}}></div>
            <div className='flex'></div>
            {
              (prompt?.allVars?.length ?? 0) !== 0 &&
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


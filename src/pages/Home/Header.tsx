import React, {useContext, useEffect, useState} from "react";

import HistoryIcon from '../../assets/icons/history.svg'
import AdvancedIcon from '../../assets/icons/model.svg'
import SettingIcon from '../../assets/icons/setting.svg'

import { requestPrompt } from "../../services/local.ts";

import { SubPromptsType } from "../../context/interface/promptInterface.tsx";
import { PromptContext } from "../../context/PromptContext.tsx";
import { StateContext } from "../../context/StateContext.tsx";

import Dropdown from "../../components/Dropdown.tsx";
import { findMainPromptAsKey, findPromptAsKey, findSubPromptAsKey } from "../../utils/findPrompt.tsx";

interface HeaderProps {
  onOpenSetting : () => void,
  onOpenHistory : () => void,
  onOpenModelConfig : () => void,
}

export default function Header(props:HeaderProps) {
    const promptContext = useContext(PromptContext);
    const stateContext = useContext(StateContext);
    const [subPrompts, setSubPrompts] = useState<SubPromptsType[]>([]);
    const [promptIndex, setPromptIndex] = useState(0);
    const [subpromptIndex, setSubpromptIndex] = useState(0);
    
    if (!promptContext) throw new Error('Header must be used in PromptContextProvider');
    if (!stateContext) throw new Error('Header must be used in StateContextProvider');

    const {
      vars,
      prompts
    } = promptContext;
    const {
      setPromptContents,
      requireVars, setRequireVars,
      note, setNote,
      prompt, setPrompt,
      prompt1Key, prompt2Key,
      setPrompt1Key, setPrompt2Key
    } = stateContext;

    useEffect(()=>{
      if (prompt1Key == null) return;

      const prompt1 = findMainPromptAsKey(prompts, prompt1Key);
      if (prompt1 == null) return;

      setSubPrompts(prompt1.list ?? []);
    }, [prompts, prompt1Key])

    useEffect(()=>{
      if (stateContext.prompt == null) return;
      
      setRequireVars(prompt.vars ?? []);
      setNewNotes(prompt.vars ?? []);
      
      requestPrompt(prompt.value)
      .then(data => setPromptContents(data));
    }, [prompt])

    const onSelectPrompt1 = (item) => {
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

    const setNewNotes = (varnames:string[]) => {
      const newNotes = {}
      for (const varname of varnames) {
        let candidate;
        if (note != null && varname in note) {
          candidate = note[varname];
        }
        else {
          candidate = vars[varname][0].value;
        }
        newNotes[varname] = candidate;
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
              items={[...prompts.map((item, index)=>{return {name:item.name, value:item, key:item.key}})]}
              onChange={(item)=>{
                setPrompt1Key(item.key);
                onSelectPrompt1(item);
                
                if (item.list == null) {
                  // nothing
                }
                else if (prompt2Key == null
                      || findSubPromptAsKey(prompts, item.key, prompt2Key) == null
                ) {
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
              requireVars.map((varname, index) => {
                return (
                  <Dropdown
                    key={index}
                    items={vars[varname]}
                    value={note[varname] ?? null}
                    onChange={(value:string)=>{
                      const newNote = {...note};
                      newNote[varname] = value;
                      setNote(newNote);
                    }}
                    titleMapper={dropdownValueFinder}
                  />
                )
              })
            }
            
            <div style={{width:'10px'}}></div>
            <div className='flex'></div>
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


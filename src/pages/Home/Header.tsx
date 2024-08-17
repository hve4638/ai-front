import React, {memo, useContext, useEffect, useState} from "react";

import { Note } from 'data/interface';

import { PromptContext } from 'context/PromptContext';
import { StoreContext } from 'context/StoreContext';
import { MemoryContext } from 'context/MemoryContext';
import { ChatSession } from 'context/interface';

import { AIModels, MODELS } from 'features/chatAI';
import { PromptInfomation } from 'features/prompts/promptInfomation';
import { PromptSublist } from 'features/prompts/promptSublist';

import Dropdown from 'components/Dropdown';
import { GoogleFontIconButton } from 'components/GoogleFontIcon';
import { LayerDropdown } from 'components/LayerDropdown';
import { AnthropicIcon, GoogleIcon, OpenAIIcon, GoogleVertexAIIcon } from 'components/Icons'

interface HeaderProps {
  onOpenSetting : () => void,
  onOpenHistory : () => void,
  onOpenModelSetting : () => void,
  onOpenRequestInfo : () => void,
  onOpenVarEditor : () => void,
}

export default function Header(props:HeaderProps) {
    const promptContext = useContext(PromptContext);
    const storeContext = useContext(StoreContext);
    const memoryContext = useContext(MemoryContext);
    if (!promptContext) throw new Error('Header must be used in PromptContextProvider');
    if (!storeContext) throw new Error('Header must be used in StoreContextProvider');
    if (!memoryContext) throw new Error('Header must be used in StoreContextProvider');
    
    const [dropdownItem, setDropdownItem] = useState<any>([]);

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

    useEffect(()=>{
        const dropdownItems:any[] = [];
        for (const category of AIModels.getCategories()) {
            const categorylist:any[] = [];
            const categorydata = {
                name : (
                  <span className='center'>
                    {
                      category.value === MODELS.GOOGLE_GEMINI &&
                      <GoogleIcon style={{marginRight: '8px'}}/>
                    }
                    {
                      category.value === MODELS.GOOGLE_VERTEXAI &&
                      <GoogleVertexAIIcon style={{marginRight: '8px'}}/>
                    }
                    {
                      category.value === MODELS.OPENAI_GPT &&
                      <OpenAIIcon style={{marginRight: '8px'}}/>
                    }
                    {
                      category.value === MODELS.CLAUDE &&
                      <AnthropicIcon style={{marginRight: '8px'}}/>
                    }
                    <span>{category.name}</span>
                  </span>
                ),
                list : categorylist
            }
            dropdownItems.push(categorydata);

            for (const model of AIModels.getModels(category.value)) {
                const modeldata = {
                    name : model.name,
                    value : {
                        modelCategory : category.value,
                        modelName : model.value,
                    }
                }
                categorylist.push(modeldata);
            }
        }
        setDropdownItem(dropdownItems);
    }, []);

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

    const onModelChange = (item:{ modelCategory:string, modelName:string })=>{
      const newSession = {
        ...currentSession,
        modelCategory : item.modelCategory,
        modelName : item.modelName,
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
              onChange={(item)=>onModelChange(item)}
              onCompare={(a, b)=>a.modelCategory===b.modelCategory && a.modelName===b.modelName}
            >
            {
              currentSession.modelCategory === MODELS.GOOGLE_GEMINI &&
              <GoogleIcon style={{marginRight: '8px'}}/>
            }
            {
              currentSession.modelCategory === MODELS.GOOGLE_VERTEXAI &&
              <GoogleVertexAIIcon style={{marginRight: '8px'}}/>
            }
            {
              currentSession.modelCategory === MODELS.OPENAI_GPT &&
              <OpenAIIcon style={{marginRight: '8px'}}/>
            }
            {
              currentSession.modelCategory === MODELS.CLAUDE &&
              <AnthropicIcon style={{marginRight: '8px'}}/>
            }
            </LayerDropdown>
            <GoogleFontIconButton
              onClick={props.onOpenModelSetting}
              className='small-icon rotate-90deg'
              value="discover_tune"
            />
            <div className='flex'/>
            <>
              <div className="dropdown-pad"/>
              <Dropdown
                className='responsive'
                itemClassName='responsive'
                value={ promptIndex[0] }
                items={[...promptList.list.map((item, index)=>{return {name:item.name, value:item, index:index}})]}
                onChange={(item)=>onChangePromptKey((item))}
                titleMapper={dropdownIndexFinder}
              />
            </>
            {
              promptSubList != null &&
              <>
                <div className="dropdown-pad"/>
                <Dropdown
                  className='responsive'
                  itemClassName='responsive'
                  value={ promptIndex[1] }
                  items={[...promptSubList.list.map((item, index)=>{return {name:item.name, value:item, index:index}})]}
                  onChange={(item)=>onChangePromptKey((item))}
                  titleMapper={dropdownIndexFinder}
                />
              </>
            }
          </div>
          <div className='seperate-section'/>
          <div className='expanded row'>
            <div className='largewidth-only'>
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
            </div>
            <div className='flex'></div>
            {
              (promptInfomation?.allVars?.length ?? 0) !== 0 &&
              <>
                <GoogleFontIconButton
                  value="edit_note"
                  onClick={props.onOpenVarEditor}
                />
                <div className='pad'/>
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


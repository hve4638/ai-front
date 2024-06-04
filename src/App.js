import {useState, useEffect} from 'react';
import { useCookies } from 'react-cookie';

import { requestGenimiAI } from './JS/FetchAPI.js'

import SettingModal from './Components/SettingModal.js';
import ConfigModal from './Components/ConfigModal.js';
import HistoryModal from './Components/HistoryModal.js';
import Select from './Components/Select.js';
import Markdown from './Components/Markdown.js';
import './Style.js'

import ArrowIcon from './Icons/arrow.svg'
import CopyIcon from './Icons/copy.svg'
import LoadingIcon from './Icons/loading.svg'
import SettingIcon from './Icons/setting.svg'
import TestIcon from './Icons/test.svg'
import HistoryIcon from './Icons/history.svg'
import ConfigIcon from './Icons/config.svg'
import ModelIcon from './Icons/model.svg'
import GithubIcon from './Icons/github.png'

const HOMEPAGE = '/deploy/ai-front';
const GITHUB_LINK='https://github.com/hve4638/ai-front'

const SEND_STATE = {
  READY : 'READY',
  LOADING : 'LOADING'
}
const RESPONSE_STATE = {
  RESPONSE : 'RESPONSE',
  ERROR : 'ERROR'
}

const COOKIE_OPTION = {
  expires: new Date(Date.now() + 31536000000)
}

const fetchHomePath = (path) => fetch(`${HOMEPAGE}${path}`)

function App() {
  const [cookies, setCookie, removeCookie] = useCookies(['apikey', 'temperature', 'topp', 'maxtoken']);

  const [textInput, setTextInput] = useState('');
  const [textOutput, setTextOutput] = useState('');
  const [apiRequest, setAPIRequest] = useState({});
  const [apiResponse, setAPIResponse] = useState({});

  const [state, setState] = useState(SEND_STATE.READY);
  const [responseState, setResposeState] = useState(RESPONSE_STATE.RESPONSE);
  const [requestAborter, setRequestAborter] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [promptText, setPromptText] = useState('{{contents}}');
  const [lang, setLang] = useState('korean');
  const [langList, setLangList] = useState([]);
  
  const [outputTokenCount, setOutputTokenCount] = useState(0);
  const [warningMessage, setWarningMessage] = useState('');

  const [showSettingModal, setShowSettingModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const [theme, setTheme] = useState('theme-dark');

  const [promptIndex, setPromptIndex] = useState({ main:-1, sub:-1 });
  const [promptList, setPromptList] = useState([]);
  const [subpromptList, setsubpromptList] = useState(null);
  const [varsList, setVarsList] = useState([]);
  const [vars, setVars] = useState([]);
  const [note, setNote] = useState({});
  
  const [history, setHistory] = useState([]);

  const responseGenimiAI = (response) => {
    console.log('<Response>');
    console.log(response);

    let tokens;
    let warning;
    try {
      tokens = response.usageMetadata.candidatesTokenCount;
    }
    catch (e) {
      console.log('fail to get token count')
      console.error(e)

      tokens = 0;
    }

    const reason = response.candidates[0].finishReason;
    const text = response.candidates[0].content?.parts[0].text ?? '';
    if (reason == 'SAFETY') warning = 'blocked by SAFETY';
    else if (reason == "MAX_TOKENS") warning = 'token limit';
    else warning = '';

    setAPIResponse(response);
    const data = {
      input : textInput,
      output : text,
      promptText : promptText,
      note : {
        lang : lang,
      },
      tokens : tokens,
      warning : warning,
      extra : {
        tokens : tokens,
        warning : warning,
      }
    }
    const newHistory = [...history];
    newHistory.push(data);
    setHistory(newHistory);
    updateCurrentDataFromReponse(data);
    setResposeState(RESPONSE_STATE.RESPONSE);
    setState(SEND_STATE.READY);
  }

  const updateCurrentDataFromReponse = (data) => {
    setTextOutput(data.output);
    setOutputTokenCount(data.tokens);
    setWarningMessage(data.warning);
    setTextOutput(replaceDoublespace(data.output));
  }
  const updateCurrentDataFromHistory = (data) => {
    setTextInput(data.input);
    setTextOutput(data.output);
    setOutputTokenCount(data.tokens);
    setLang(data.note.lang);
    setWarningMessage(data.warning);
    setTextOutput(replaceDoublespace(data.output));
  }
  
  const testEnabled = false;
  const onTest = () => {
    //setTextOutput(cookies.apikey)
  }

  useEffect(()=>{
    if (cookies.apikey == null) setCookie('apikey', '', COOKIE_OPTION)
    if (cookies.temperature == null) setCookie('temperature', 1.0, COOKIE_OPTION)
    if (cookies.topp == null) setCookie('topp', 1.0, COOKIE_OPTION)
    if (cookies.maxtoken == null) setCookie('maxtoken', 2000, COOKIE_OPTION)

    fetchHomePath('/prompts/list.json')
    .then(res => res.json())
    .then(data => {
      setPromptList(data.prompts);
      setVarsList(data.vars);
    })
    .catch(err => setPromptList([{'name':'없음', 'value':'value'}]));
    
    fetchHomePath('/lang.json')
    .then(res => res.json())
    .then(data => setLangList(data))
    .catch(err => setPromptList('korean'));
  }, [])

  useEffect(()=>{
    console.log(`prompt update\n${promptText}`)
  }, [promptText])

  return (
    <div className={`column fill ${theme}`}>
      {
        showSettingModal &&
        <SettingModal
          maxtoken = {cookies.maxtoken}
          temperature = {cookies.temperature}
          topp = {cookies.topp}
          apikey = {cookies.apikey}
          onClose = {({temperature, topp, apikey, maxtoken}) => {
              if (temperature != null) setCookie('temperature', temperature, COOKIE_OPTION);
              if (topp != null) setCookie('topp', topp, COOKIE_OPTION);
              if (apikey != null) setCookie('apikey', apikey, COOKIE_OPTION);
              if (maxtoken != null) setCookie('maxtoken', maxtoken, COOKIE_OPTION);
              setShowSettingModal(false);
          }}
        />
      }
      {
        showConfigModal &&
        <ConfigModal
          promptText={promptText}
          onClose = {() => setShowConfigModal(false)}
        />
      }
      {
        showHistoryModal &&
        <HistoryModal
          history = {history}
          onClick={(data) => {
            updateCurrentDataFromHistory(data);
            setShowHistoryModal(false);
          }}
          onClose = {() => setShowHistoryModal(false)}
        />
      }
        
      <header className='row'>
        <div className='flex row' style={{padding:'0px 32px 0px 0px'}}>
          <a
            className='undraggable'
            href={window.location.href}
            >AI Front</a>
          {
            false &&
            <IconButton
              value='contrast'
              style={{fontSize:'32px', margin: '0px 8px 0px 8px'}}
              onClick={
                ()=>{
                  if (theme == 'theme-dark') setTheme('theme-light')
                  else setTheme('theme-dark')
                }
              }
            />
          }
          <div className='flex'></div>
          <Select
            name='mainprompt'
            onChange={(index)=>{
              console.log(index)
              const item = promptList[index];
              
              if (item.value != null) {
                setsubpromptList(null);
                
                setVars(item.vars);
                
                fetchHomePath(`/prompts/${item.value}`)
                .then(res => res.text())
                .then(data => setPromptText(data));
              }
              else if (item.list != null) {
                setsubpromptList(item.list);
                setVars(item.list[0].vars);
                
                fetchHomePath(`/prompts/${item.list[0].value}`)
                .then(res => res.text())
                .then(data => setPromptText(data));
              }
              else {
                console.error('invalid promptText selected')
              }
            }}
          >
          {
            promptList.map((item, index) => (
              <option key={index} value={index}>{item.name}</option>
            ))
          }
          </Select>
          {
            subpromptList != null &&
            <Select
              name='subprompt'
              style={{marginLeft :'15px'}}
              onChange={(index)=>{
                const item = subpromptList[index];
                setVars(item.vars);

                fetchHomePath(`/prompts/${item.value}`)
                .then(res => res.text())
                .then(data => setPromptText(data));
              }}
            >
                {
                  subpromptList.map((item, index) => (
                    <option key={index} value={index}>{item.name}</option>
                  ))
                }
            </Select>
          }
        </div>
        <div className='noflex seprate-section'>
        </div>
        <div className='flex row'>
          {
            //@TODO : vars 추가 필요
            false && 
            vars.map((value, index) => (
              <div>
                {value}
              </div>
            ))
          }
          <Select
            name='lang'
            onChange={(value)=>setLang(value)}
          >
              {
                langList.map((item, index) => (
                  <option key={index} value={item.value}>{item.name}</option>
                ))
              }
          </Select>
          <div style={{width:'10px'}}></div>
          <div className='flex'></div>
          <div className='clickable' style={{marginRight: '16px'}}>
            {
              testEnabled &&
              <img
                src={TestIcon}
                onClick={(e)=>onTest()}
              />
            }
          </div>
          <HeaderIcon
            src={HistoryIcon}
            onClick={()=>setShowHistoryModal(true)}
          />
          <HeaderIcon
            src={ModelIcon}
            onClick={()=>setShowConfigModal(true)}
          />
          <HeaderIcon
            src={SettingIcon}
            onClick={()=>setShowSettingModal(true)}
          />
        </div>
      </header>
      <main className='flex row'
        style={{overflow:'hidden'}}
      >
        <div id='input-section' className='translate-input-container flex'>
            <textarea
              className='translate-input scrollbar wfill fontstyle'
              spellCheck="false"
              value={textInput}
              onChange={(e)=>{setTextInput(e.target.value)}}
              >
            </textarea>
        </div>
        <div className='seprate-section noflex center undraggable'>
          {
            state === SEND_STATE.READY && 
            <img 
              id='translate-button'
              src={ArrowIcon}
              draggable='false'
              onClick={(e)=>{
                setState(SEND_STATE.LOADING);

                const contents = formatPrompt(promptText, {lang : lang, contents: textInput})
                const controller = requestGenimiAI(contents, {
                  maxToken : cookies.maxtoken,
                  apikey : cookies.apikey,
                  then : data => responseGenimiAI(data),
                  onerror : (err) => {
                    console.log('error occured')
                    console.log(err)
                    setResposeState(RESPONSE_STATE.ERROR);
                    setErrorMessage(err + '');
                    setState(SEND_STATE.READY);
                  }
                });
                setRequestAborter(controller);
              }}
            />
          }
          {
            state === SEND_STATE.LOADING && 
            <img 
              className='rotate'
              src={LoadingIcon}
              draggable='false'
              onClick={(e)=>{
                if (requestAborter != null) {
                  requestAborter.abort('Abort');
                  setRequestAborter(null);
                }
              }}
            />
          }
        </div>
        <div id='output-section' className='translate-output-container flex wfill'>
          <div className='translate-output scrollbar wfill' style={{overflow:'auto'}}>
            <div className='copy-button-container'>
              <img
                id='copy-button'
                src={CopyIcon}
                draggable='false'
                onClick={(e)=>{window.navigator.clipboard.writeText(textOutput)}}
                />
            </div>
            <div className='token-display-container undraggable'>
              {
                outputTokenCount != 0 &&
                `token : ${outputTokenCount}`
              }
            </div>
            <div className='warning-display-container undraggable'>
              {warningMessage}
            </div>
            <div id='output-container' className='flex column fontstyle'>
              {
                responseState === RESPONSE_STATE.RESPONSE &&
                <Markdown content={textOutput}></Markdown>
              }
              {
                responseState === RESPONSE_STATE.ERROR &&
                <div className='flex column'>
                  <p style={{margin: '0px 0px 32px 0px'}}>Exception Occur!</p>
                  <p style={{color:'red'}}>{errorMessage}</p>
                </div>
              }
              <div style={{height:'80px'}}></div>
            </div>
          </div>
        </div>
      </main>
      <footer
        className='noflex row'
      >
        <div style={{ height: '35px' }}>
          <img
            className='clickable-animation'
            src={GithubIcon}
            onClick={()=> window.open(GITHUB_LINK)}
          />
        </div>
      </footer>
    </div>
  );
}

function formatPrompt(promptText, { lang, contents }) {
  let str = promptText.replaceAll('{{lang}}', lang)
  str = str.replaceAll('{{contents}}', contents)

  return str;
}

function replaceDoublespace(str) {
  return str.replace(/([^\n]|^)\n(?!\n)/g, '$1\n\n');
}

function IconButton({value, style, onClick}) {
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

const HeaderIcon = ({src, onClick}) => (
  <div style={{ marginLeft: '15px' }}>
    <img
      className='clickable-animation' src={src}
      onClick={(e)=>onClick()}
    />
  </div>
  )

export default App;

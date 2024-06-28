import React, { useContext } from 'react'
import CopyIcon from '../../assets/icons/copy.svg'

import { APIResponse } from '../../data/interface.js'

import { copyToClipboard } from '../../utils/clipboard.tsx'


import Markdown from '../../components/Markdown.tsx'
import { StateContext } from '../../context/StateContext.tsx'
import { LineByLineRenderer } from '../../components/LineByLine.tsx'

interface OutputFieldProps {
  className?:string,
  response:APIResponse,
}

export default function OutputField(props:OutputFieldProps) {
  const { className='', response } = props;
  const stateContext = useContext(StateContext);
  if (stateContext == null) {
    throw new Error('OutputField required StateContext');
  }
  // window.navigator.clipboard.writeText()
  return (
      <div className={`${className} textarea-output-container`}>
        <div
          className='textarea-output scrollbar'
          style={{overflow:'auto'}}
        >
          <div className='copy-button-container undraggable'>
            <img
              id='copy-button'
              src={CopyIcon}
              draggable='false'
              onClick={(e)=>{copyToClipboard(response.output ?? '')}}
              />
          </div>
          <div className='token-display-container undraggable'>
            {
              (response.tokens ?? 0) != 0 &&
              `token : ${response.tokens}`
            }
          </div>
          <div className='warning-display-container undraggable'>
            {response.warning}
          </div>

          <div
            className='textarea-textstyle fontstyle'
            style={{marginBottom:"80px"}}  
          >
            {
              !response.normalresponse
              ?
              <div className='flex column'>
                <p style={{margin: '0px 0px 32px 0px'}}>Exception Occur!</p>
                <p style={{color:'red'}}>{response.error}</p>
              </div>
              : stateContext.markdownMode
              ?
              <div className='markdown'>
                <Markdown content={response.output}></Markdown>
              </div>
              : stateContext.lineByLineMode
              ?
              <LineByLineRenderer content={response.output}/>
              :
              <pre className='fontstyle'>
                {response.output}
              </pre>
            }
          </div>
        </div>
      </div>
    );
}


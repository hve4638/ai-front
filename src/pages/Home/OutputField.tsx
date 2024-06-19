import React, { useContext } from 'react'
import CopyIcon from '../../assets/icons/copy.svg'

import { APIResponse } from '../../data/interface.js'

import Markdown from '../../components/Markdown.tsx'
import { StateContext } from '../../context/StateContext.tsx'

const ResponseState = {
  NORMAL: 'NORMAL',
  ERROR: 'ERROR'
} as const
export type ResponseState = typeof ResponseState[keyof typeof ResponseState]


export interface Response {
  text:string,
  error:string
  state:ResponseState,
  tokens:number|null,
  warning:string
}

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

  return (
      <div className={`${className} textarea-output-container`}>
        <div className='textarea-output translate-output scrollbar wfill' style={{overflow:'auto'}}>
          <div className='copy-button-container undraggable'>
            <img
              id='copy-button'
              src={CopyIcon}
              draggable='false'
              onClick={(e)=>{window.navigator.clipboard.writeText(response.output ?? '')}}
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
          <div className='textarea-textstyle flex column fontstyle'>
            {
              response.normalresponse && stateContext.markdownMode &&
              (
                <div className='markdown'>
                  <Markdown content={response.output}></Markdown>
                </div>
              )
            }
            {
              response.normalresponse && !stateContext.markdownMode &&
              (
                <pre
                  className=''
                >
                  {response.output}
                </pre>
              )
            }
            {
              !response.normalresponse &&
              <div className='flex column'>
                <p style={{margin: '0px 0px 32px 0px'}}>Exception Occur!</p>
                <p style={{color:'red'}}>{response.error}</p>
              </div>
            }
            <div style={{height:'80px'}}></div>
          </div>
        </div>
      </div>
    );
}


import React, { useContext, useEffect, useState } from 'react'
import { APIResponse } from '../../data/interface.js'

import Markdown from '../../components/Markdown.tsx'
import { StoreContext } from '../../context/StoreContext.tsx'
import { LineByLineRenderer } from '../../components/LineByLine.tsx'
import { GoogleFontIcon } from '../../components/GoogleFontIcon.tsx'
import { copyToClipboard } from '../../utils/clipboard.tsx'

interface OutputFieldProps {
  className?:string,
  response:APIResponse,
}

export default function OutputField({ className='', response }:OutputFieldProps) {
  const storeContext = useContext(StoreContext);

  if (!storeContext) throw new Error('OutputField required StoreContext');
  
  const [copyPing, setCopyPing] = useState(false);
  const [copyEffect, setCopyEffect] = useState(false);

  useEffect(()=>{
    if (copyPing) {
      copyToClipboard(response.output ?? '');
      
      setCopyEffect(true);
      setTimeout(()=>setCopyEffect(false), 300);

      setCopyPing(false);
    }
  }, [copyPing]);

  useEffect(()=>{
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.shiftKey && (event.key === 'C' || event.key === 'c')) {
        setCopyPing(true);
        event.preventDefault();
      }
    }
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [])

  return (
      <div className={`${className} textfield output-section-container`}>
        <div
          className='output-section scrollbar'
          style={{overflow:'auto'}}
        >
          <GoogleFontIcon
            className={'floating-button clipboard-icon' + (copyEffect ? ' activate' : ' deactivate')}
            value='content_paste'
            onClick={()=>{
              setCopyPing(true);
            }}
          />
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
            className='output-section-textarea fontstyle scrollbar'
          >
            {
              !response.normalresponse
              ?
              <div className='flex column'>
                <p style={{margin: '0px 0px 32px 0px'}}>Exception Occur!</p>
                <p style={{color:'red'}}>{response.error}</p>
              </div>
              : storeContext.markdownMode
              ?
              <div className='markdown'>
                <Markdown content={response.output}></Markdown>
              </div>
              : storeContext.lineByLineMode
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


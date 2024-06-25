import React from "react";
import { useEffect, useState } from "react";

export function LineByLineRenderer({content}) {
    const [ parsed, setParesed ] = useState([]);

    useEffect(()=>{
      setParesed(parseText(content));
    }, [content])

    return (
        <div className="fontstyle column linebyline-container">
        {
            parsed.map((value, index)=>value)
        }
        </div>
    );
}

const RE_TAG_GLOBAL = /<(.*?)>\s*(.*?)\s*<\/\1>/g;
const RE_TAG = /<(.*?)>\s*(.*?)\s*<\/\1>/;
function parseText(input:string) {
    const splitted = input.match(RE_TAG_GLOBAL);
    const result:any = [];

    splitted?.forEach(text => {
      const tag = RE_TAG.exec(text)
      if (tag == null) {
        // 코드 논리 오류
        throw new Error("This code path should not be possible.")
      }
      
      const [_, name, content] = tag;
      if (name == "INPUT") {
        result.push(
          <p className='original'>{content}</p>
        );
      }
      else if (name == "OUTPUT") {
        result.push(
          <p className='translation'>{content}</p>
        );
      }
    });
    
    return result;
}
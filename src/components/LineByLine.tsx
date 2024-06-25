import React from "react";
import { useEffect, useState } from "react";

function parseText(input) {
    // Split the input text by lines
    const lines = input.split('\n').filter(line => line.trim() !== '');
    
    // Initialize the result array
    const result:any = [];
    
    // Regex to match the INPUT and OUTPUT lines
    const inputRegex = /^<INPUT>\s*(.*)\s*<\/INPUT>$/;
    const outputRegex = /^<OUTPUT>\s*(.*)\s*<\/OUTPUT>$/;
    
    // Iterate over each line
    lines.forEach(line => {
      let match;
      if (match = line.match(inputRegex)) {
        result.push(
            <p className='blue'>{match[1]}</p>
        );
      } else if (match = line.match(outputRegex)) {
        result.push(
            <p className='red'>{match[1]}</p>
        );
      }
    });
    
    return result;
  }

function LineByLineRenderer({content}) {
    const [ parsed, setParesed ] = useState([]);

    useEffect(()=>{
        
    }, [content])

    return (
        <div>
        {
            parsed.map((value, index)=>value)
        }
        </div>
    );
}

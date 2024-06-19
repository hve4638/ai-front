import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';

const Emphasize = ({ children }) => <strong>{children}</strong>;

const customRenderers = {
  p({ children }) {
    if (typeof children !== 'string') {
        return <p>{children}</p>;
    }
    const items = []
    
    //console.log('Input: ' + children)
    const splited = splitString(children)
    //console.log(splited)
    
    return (
        <p>
            {
            splited.map((text:string, index)=>{
                if (text.startsWith('"')) {
                    return (<span key={index} className='say'>{text}</span>);
                }
                else if (text.startsWith("'")) {
                    return (<span key={index} className='think'>{text}</span>);
                }
                else {
                    return text
                }
            })
            }
        </p>
    );
  }
};

const splitString = (str:string) => {
    const parts:string[] = [];
    let text:string = str.trim();
    const pattern_say = /^("[^"]*")(.*)$/
    const pattern_think = /^('[^']*')(.*)$/
    const pattern_plain = /^([^"'*]+)(["'*].*)$/
    const match = (pattern) => pattern.exec(text);

    let group = []
    while (text.trim() != "") {
        if (group = match(pattern_say)) {
            parts.push(group[1]);
            text = group[2];
        }
        else if (group = match(pattern_think)) {
            parts.push(group[1]);
            text = group[2];
        }
        else if (group = match(pattern_plain)) {
            parts.push(group[1]);
            text = group[2];
        }
        else {
            parts.push(text);
            text = ""
        }
    }
    console.log('splitting');
    console.log(text);

    return parts;
}

function Markdown({content}) {
    return (
        <ReactMarkdown
            children={content}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeHighlight]}
            components={customRenderers}
        />
    );
}

export default Markdown;
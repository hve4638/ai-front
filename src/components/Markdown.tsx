import React, { ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import { splitByQuotes } from '../utils/splitByQuotes.tsx';

const Emphasize = ({ children }) => <strong>{children}</strong>;

const customRenderers = {
  p({ children }) {
    let input: ReactNode[];
    if (typeof children === 'object') {
        input = children;
    }
    else if (typeof children === 'string') {
        input = [ children ];
    }
    else {
        console.error('Markdown : parse failed');
        return children;
    }
    
    const items:ReactNode[] = [];
    for (const item of input) {
        if (typeof item === 'string') {
            const splited = splitByQuotes(item);
            items.push(...splited);
        }
        else {
            items.push(item);
        }
    }
    
    return (
        <p>
            {
            items.map((item:ReactNode, index)=>{
                if (typeof item !== 'string') {
                    return item;
                }
                else if (item.startsWith('"')) {
                    return (<span key={index} className='say'>{item}</span>);
                }
                else if (item.startsWith("'")) {
                    return (<span key={index} className='accent'>{item}</span>);
                }
                else {
                    return item;
                }
            })
            }
        </p>
    );
  }
};

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
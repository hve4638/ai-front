import React, { ReactNode } from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';

import { splitByQuotes } from '@/utils/splitByQuotes';
import classNames from 'classnames';


const customRenderers: Partial<Components> = {
    p({ children }) {
        let input: ReactNode[] | any;

        if (children == null) {
            return;
        }
        else if (typeof children === 'string') {
            input = [children];
        }
        else if (typeof children[Symbol.iterator] === 'function') {
            input = children;
        }
        else {
            return children;
        }

        const items: ReactNode[] = [];
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
                    items.map((item: ReactNode, index) => {
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

function MarkdownArea({ 
    className='',
    style={},
    content
}:{ content: string, className?: string, style?: React.CSSProperties }) {
    return (
        <div
            className={classNames('markdown-area', className)}
            style={style}
        >
            <ReactMarkdown
                children={content}
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypeHighlight]}
                components={customRenderers}
            />
        </div>
    );
}

export default MarkdownArea;
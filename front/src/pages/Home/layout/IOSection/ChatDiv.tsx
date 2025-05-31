import { useEffect, useRef } from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';
import { Flex, Row } from '@/components/layout';
import { GIconButton } from '@/components/GoogleFontIcon';

type ChatDivProps = {
    side: 'input' | 'output';
    value: string;
}

function ChatDiv({
    side,
    value,
}: ChatDivProps) {
    const divRef = useRef<HTMLDivElement>(null);
    const sideClass = side === 'input' ? styles['input-side'] : styles['output-side'];
    
    return (
        <div
            className={classNames(sideClass)}
            ref={divRef}
            tabIndex={-1}
            onFocus={()=>{
            }}
            onKeyDown={(e) => {
                if (e.key === 'a' && e.ctrlKey) {
                    if (divRef.current) {
                        const range = document.createRange();
                        range.selectNodeContents(divRef.current);

                        const selection = window.getSelection();
                        if (selection) {
                            selection.removeAllRanges();
                            selection.addRange(range);
                        }
                    }

                    e.preventDefault();
                }  
            }}
        >
            {
                value.split('\n').map((line, index) => (
                    <div key={index}>{line}</div>
                ))
            }
            {
                side === 'input' && 
                <Row style={{ gap: '0.25em', fontSize: '1.15em' }}>
                    <Flex/>
                    <GIconButton
                        value='content_paste'
                        hoverEffect='square'
                    />
                    <GIconButton
                        value='edit'
                        hoverEffect='square'
                    />
                </Row>
            }
            {
                side === 'output' && 
                <Row style={{ gap: '0.25em', fontSize: '1.15em' }}>
                    <Flex/>
                    <GIconButton
                        value='content_paste'
                        hoverEffect='square'
                    />
                    {/* <GIconButton
                        value='device_hub'
                        hoverEffect='square'
                    /> */}
                    <GIconButton
                        value='edit'
                        hoverEffect='square'
                    />
                    <GIconButton
                        value='refresh'
                        hoverEffect='square'
                    />
                </Row>
            }
        </div>
    )
}

export default ChatDiv;
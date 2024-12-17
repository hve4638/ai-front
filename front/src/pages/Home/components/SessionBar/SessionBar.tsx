import { useCallback, useEffect, useRef, useState } from 'react';
import { Align, Center, Column, Flex, MouseDrag, Row } from 'lib/flex-widget';
import { clamp } from 'utils/math';
import { ChatSessionColor, ChatSessionStatus } from 'features/sessions';
import SessionTab from './SessionTab';
import SessionAddButton from './SessionAddButton';
import useDiff from 'hooks/useDiff';
import { ChatSessionTab } from 'features/sessions/types';

const NO_DRAG = -1;

function SessionBar({

}) {
    const [diffPos] = useDiff(0, (n, p)=>n-p);
    const [tabX, setTabX] = useState<number[]>([]);
    const [offsetBias, setOffsetBias] = useState<number[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const [tabs, setTabs] = useState<ChatSessionTab[]>([
        {
            name : '세션',
            color : ChatSessionColor.DEFAULT,
            deleteLock : true,
            link : 0,
            modelKey : 'session1',
            promptKey : 'session1',
            status : ChatSessionStatus.IDLE,
            tabOrder : 0,
        },
        {
            name : '세션 2',
            color : ChatSessionColor.RED,
            deleteLock : true,
            link : 1,
            modelKey : 'session1',
            promptKey : 'session1',
            status : ChatSessionStatus.IDLE,
            tabOrder : 1,
        },
        {
            name : '세션 3',
            color : ChatSessionColor.RED,
            deleteLock : true,
            link : 2,
            modelKey : 'session1',
            promptKey : 'session1',
            status : ChatSessionStatus.IDLE,
            tabOrder : 2,
        },
    ]);
    const [adjacentTabs, setAdjacentTabs] = useState<ChatSessionTab[]>([]);
    const [tempCurrentLink, setTempCurrentLink] = useState<number>(0);
    const [draggingTabLink, setDraggingTabLink] = useState<number>(NO_DRAG);
    const [draggingTabX, setDraggingTabX] = useState<number>(0);

    const rect = containerRef.current?.getBoundingClientRect();
    const barSize = rect?.width ?? 600;
    const tabSize = clamp(Math.floor(barSize / 1), 50, 200);
    
    const updateAdjacentTabs = useCallback((index:number) => {
        setAdjacentTabs(prev => {
            const next = tabs.filter((tab) => tab.tabOrder === index-1 || tab.tabOrder === index+1);
            return next;
        });
    }, [tabs]);

    const onDragBegin = (tab:ChatSessionTab, x:number) => {
        const rect = containerRef.current?.getBoundingClientRect();
        const left = rect?.left ?? 0;
        const right = rect?.right ?? 600;
        diffPos(clamp(x, left, right));
        updateAdjacentTabs(tab.tabOrder);
        setDraggingTabLink(tab.link);
        setTempCurrentLink(tab.link);
        setDraggingTabX(tab.tabOrder * tabSize);
    }

    const onDragSession = (tab:ChatSessionTab, x:number) => {
        const rect = containerRef.current?.getBoundingClientRect();
        const left = rect?.left ?? 0;
        const right = rect?.right ?? 600;
        
        const added = diffPos(clamp(x, left, right));

        const newX = draggingTabX + added;
        setDraggingTabX(newX);
        
        const tx = newX + tabSize / 2;
        for (const adjacentTab of adjacentTabs) {
            if (
                (adjacentTab.tabOrder < tab.tabOrder && tx < (adjacentTab.tabOrder+1) * tabSize) || 
                (adjacentTab.tabOrder > tab.tabOrder && tx > adjacentTab.tabOrder * tabSize)
            ) {
                // tabs를 변경하지 않기 때문에 명시적으로 재랜더링이 이루어지지 않음
                // updateAdjacentTabs가 그 역할을 대신하므로 수정시 주의 필요
                const newOrder = adjacentTab.tabOrder;
                adjacentTab.tabOrder = tab.tabOrder;
                tab.tabOrder = newOrder;

                updateAdjacentTabs(newOrder);
                break;
            }
        }
    }

    const onDragEnd = (offset:number, x:number) => {
        setTabX(tabs.map((session, index) => {
            return index * tabSize;
        }));
    }

    useEffect(() => {
        const newSessionList = tabs.map((session, index) => {
            return index * tabSize;
        })
        
        if (newSessionList.length <= 1) {
            setOffsetBias([]);
        }
        else {
            const biasSize = newSessionList.length - 1;
            const bias = new Array(biasSize).fill(0);
            for (let i = 0; i < biasSize ; i++) {
                bias[i] = Math.round((newSessionList[i] + newSessionList[i+1]) / 2);
            }
            setOffsetBias(bias);
        }
        
        setTabX(newSessionList);
    }, [barSize, tabSize]);

    return (
        <Row
            ref={containerRef}
            className='session-bar undraggable relative'
            style={{
                padding: '0px 0px 4px 8px',
                height: '28px',
            }}
            rowAlign={Align.Start}
        >
            {
                tabs.map((tab, index) => (
                    <MouseDrag
                        key={tab.link}
                        onDragBegin={(x, y) => {
                            onDragBegin(tab, x);
                        }}
                        onDrag={(x, y) => {
                            onDragSession(tab, x);
                            
                        }}
                        onDragEnd={(x, y) => {
                            diffPos(x);
                            onDragEnd(index, x);
                            setAdjacentTabs([]);
                            setDraggingTabLink(NO_DRAG);
                        }}
                        relative={false}
                    >
                        <SessionTab
                            name={tab.name ?? '새 세션'}
                            width={`${tabSize}px`}
                            enabled={tab.link == tempCurrentLink}
                            x={
                                tab.link === draggingTabLink ?
                                Math.min(draggingTabX, (tabs.length-1) * tabSize) :
                                tab.tabOrder * tabSize
                            }
                        />
                    </MouseDrag>
                ))
            }
            <SessionAddButton
                x={tabX.length * tabSize}
                onClick={() => {
                    console.log('add session');
                }}
            />
        </Row>
    );
}

export default SessionBar;
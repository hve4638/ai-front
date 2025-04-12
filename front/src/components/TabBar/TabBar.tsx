import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Align, Center, Column, Flex, MouseDrag, Row } from 'components/layout';
import { clamp } from 'utils/math';
import TabCore from './TabCore';
import SessionAddButton from './TabAddButton';
import useDiff from 'hooks/useDiff';
import useDebounce from 'hooks/useDebounce';
import TabContainer from './TabContainer';
import type { TabRequired, TabBarProps } from './types';
import { useShortcutSignalStore } from '@/stores';

interface TabItem<T extends TabRequired> {
    index : number;
    item : T;
}

interface AdjacentTabs<T extends TabRequired> {
    left? : TabItem<T>;
    right? : TabItem<T>;
}

function TabBar<T extends TabRequired, TRequired extends Partial<T> & TabRequired>({
    items,
    focus,
    onFocus,
    onChangeTabOrder,
    onAdd,
    onUndoRemove,
    onRemove,
    enableHotkey = true,
    tabRender,
}:TabBarProps<T, TRequired>) {
    const tabBarRef = useRef<HTMLDivElement>(null);
    const [tabBarSize, setTabBarSize] = useState<number>(600);
    const [tabSize, setTabSize] = useState<number>(200);

    const [diffPos] = useDiff(0, (n, p)=>n-p);
    const [adjacentTabs, setAdjacentTabs] = useState<AdjacentTabs<T>>({});
    const [draggingTab, setDraggingTab] = useState<TabItem<T>|null>(null);
    const [noAnimation, setNoAnimation] = useState<boolean>(false);
    const [smoothDraggingTab, setSmoothDraggingTab] = useState<boolean>(false);

    // resize 이벤트가 빈번하게 발생하는 것을 방지하기 위함
    const disableNoAnimation = useDebounce(()=>setNoAnimation(false), 100);

    const [draggingTabX, setDraggingTabX] = useState<number>(0);

    // strict 엄밀한 탭 이동 범위
    const tabXHardRange = useMemo(()=>[0, (items.length-1) * tabSize], [items, tabSize]);

    // 확장 탭 이동 범위, 이 범위를 벗어나면 HardRange로 범위가 좁혀짐
    // 범위를 벗어나면 튕기는 효과를 주기 위함
    const tabXSoftRange = useMemo(()=>[-18, (items.length-1) * tabSize+18], [items, tabSize]);

    const [hardLimit, setHardLimit] = useState(false);
    const tabXRange = useMemo(()=>(hardLimit ? tabXHardRange : tabXSoftRange), [hardLimit, tabXHardRange, tabXSoftRange]);

    const [tabs, tabMap] = useMemo(()=>{
        const tabs:TabItem<T>[] = [];
        const tabMap = new Map<number, TabItem<T>>();
        items.forEach((item, index) => {
            const tab = { index, item, };
            tabs.push(tab);
            tabMap.set(index, tab);
        });
        return [tabs, tabMap];
    }, [items])

    
    const updateAdjacentTabs = useCallback((tab:TabItem<T>) => {
        setAdjacentTabs({
            left : tabMap.get(tab.index-1),
            right : tabMap.get(tab.index+1),
        });
    }, [tabs]);

    const swapTabOrder = useCallback((tab1:TabItem<T>, tab2:TabItem<T>) => {
        const order = tab1.index;
        tab1.index = tab2.index;
        tab2.index = order;

        tabMap.set(tab1.index, tab1);
        tabMap.set(tab2.index, tab2);
    }, [tabs]);

    const onDragBegin = (tab:TabItem<T>, x:number) => {
        const rect = tabBarRef.current?.getBoundingClientRect();
        const left = rect?.left ?? 0;
        const right = rect?.right ?? 600;
        diffPos(clamp(x, left, right));

        updateAdjacentTabs(tab);
        setDraggingTab(tab);
        setDraggingTabX(tab.index * tabSize);
        setHardLimit(false);
    }

    const onDrag = (tab:TabItem<T>, x:number) => {
        const rect = tabBarRef.current?.getBoundingClientRect();
        const left = rect?.left ?? 0;
        const right = rect?.right ?? 600;
        
        const added = diffPos(clamp(x, left, right));
        const newX = draggingTabX + added;
        setDraggingTabX(newX);
        
        if (!hardLimit && (newX <= tabXSoftRange[0] || newX >= tabXSoftRange[1])) {
            setSmoothDraggingTab(true);
            setTimeout(()=>setSmoothDraggingTab(false), 300);
            setHardLimit(true);
        }
        else if (hardLimit && (newX >= tabXHardRange[0] && newX <= tabXHardRange[1])) {
            setSmoothDraggingTab(false);
            setHardLimit(false);
        }
        
        const tx = newX + tabSize / 2;
        if (adjacentTabs.left && tx < (adjacentTabs.left.index+1) * tabSize) {
            swapTabOrder(tab, adjacentTabs.left);
            updateAdjacentTabs(tab);
        }
        else if (adjacentTabs.right && tx > (adjacentTabs.right.index) * tabSize) {
            swapTabOrder(tab, adjacentTabs.right);
            updateAdjacentTabs(tab);
        }
    }

    const onDragEnd = (tab:TabItem<T>, x:number) => {
        diffPos(x);
        setDraggingTab(null);

        for(let i=0; i<tabs.length; i++) {
            if (tabs[i].index != i) {
                const items:T[] = [];
                for (let j=0; j<tabs.length; j++) {
                    items.push(tabMap.get(j)!.item);
                }
                setTimeout(()=>{
                    onChangeTabOrder(items);
                }, 150);
                break;
            }
        }
    }

    const changeFocusIndex = (index:number) => {
        if (index < tabs.length) {
            onFocus(tabs[index].item, index);
        }
    }

    useEffect(() => {
        const resizeHandler = ()=>{
            const rect = tabBarRef.current?.getBoundingClientRect();
            const newTabBarSize = rect?.width ?? 600;
            setTabBarSize(newTabBarSize);
            setTabSize(clamp(Math.floor((newTabBarSize - 32) / items.length), 50, 200));
            setNoAnimation(true);
            disableNoAnimation();
        }
        resizeHandler();

        window.addEventListener('resize', resizeHandler);
        return () => {
            window.removeEventListener('resize', resizeHandler);
        }
    }, [items]);


    useEffect(()=>{
        const unsubscribes = [
            useShortcutSignalStore.subscribe(
                (signal)=>signal.create_tab,
                ()=>onAdd(),
            ),
            useShortcutSignalStore.subscribe(
                (signal)=>signal.remove_tab,
                ()=>onRemove(focus as unknown as T, tabs.findIndex(tab=>tab.item.key === focus.key))
            ),
            useShortcutSignalStore.subscribe(
                (signal)=>signal.undo_remove_tab,
                ()=>onUndoRemove(),
            ),
            useShortcutSignalStore.subscribe(
                (signal)=>signal.next_tab,
                ()=>{
                    const index = tabs.findIndex(tab=>tab.item.key === focus.key);
                    let nextIndex = index + 1;
                    nextIndex %= tabs.length;

                    onFocus(tabs[nextIndex].item, nextIndex);
                }
            ),
            useShortcutSignalStore.subscribe(
                (signal)=>signal.prev_tab,
                ()=>{
                    const index = tabs.findIndex(tab=>tab.item.key === focus.key);
                    let nextIndex = index - 1;
                    if (nextIndex < 0) {
                        nextIndex += tabs.length;
                    }

                    onFocus(tabs[nextIndex].item, nextIndex);
                }
            ),
            useShortcutSignalStore.subscribe(
                (signal)=>signal.tab1,
                ()=>changeFocusIndex(0)
            ),
            useShortcutSignalStore.subscribe(
                (signal)=>signal.tab2,
                ()=>changeFocusIndex(1)
            ),
            useShortcutSignalStore.subscribe(
                (signal)=>signal.tab3,
                ()=>changeFocusIndex(2)
            ),
            useShortcutSignalStore.subscribe(
                (signal)=>signal.tab4,
                ()=>changeFocusIndex(3)
            ),
            useShortcutSignalStore.subscribe(
                (signal)=>signal.tab5,
                ()=>changeFocusIndex(4)
            ),
            useShortcutSignalStore.subscribe(
                (signal)=>signal.tab6,
                ()=>changeFocusIndex(5)
            ),
            useShortcutSignalStore.subscribe(
                (signal)=>signal.tab7,
                ()=>changeFocusIndex(6)
            ),
            useShortcutSignalStore.subscribe(
                (signal)=>signal.tab8,
                ()=>changeFocusIndex(7)
            ),
            useShortcutSignalStore.subscribe(
                (signal)=>signal.tab9,
                ()=>changeFocusIndex(8)
            ),
        ]

        return () => {
            unsubscribes.forEach((unsub)=>unsub());
        }
    }, [enableHotkey, tabs, focus])


    return (
        <Row
            ref={tabBarRef}
            className='session-bar undraggable relative'
            style={{
                padding: '0px 0px 0px 8px',
                height: '32px',
            }}
            rowAlign={Align.Start}
        >
            {
                tabs.map((tab, index) => {
                    const onClick = () => {
                        onFocus(tab.item, tab.index);
                    }
                    const onClose = () => {
                        onRemove(tab.item, tab.index);
                    }

                    return (<MouseDrag
                        key={tab.item.key}
                        onDragBegin={(x, y) => {
                            onDragBegin(tab, x);
                        }}
                        onDrag={(x, y) => {
                            onDrag(tab, x);
                        }}
                        onDragEnd={(x, y) => {
                            onDragEnd(tab, x);
                        }}
                        relative={false}
                    >
                        <TabContainer
                            noAnimation={noAnimation}
                            style={
                                (
                                    draggingTab === tab &&
                                    smoothDraggingTab
                                ) ?
                                {
                                    transition: 'left 0.15s ease',
                                } :
                                {

                                }
                            }
                            name={tab.item.name ?? ''}
                            widthPx={tabSize}
                            enabled={tab.item.key == focus.key}
                            x={
                                tab === draggingTab ?
                                clamp(draggingTabX, tabXRange[0], tabXRange[1]) :
                                tab.index * tabSize
                            }
                            onClick={onClick}
                            onClose={onClose}
                        >
                        {
                            tabRender({
                                item: tab.item,
                                widthPx : tabSize,
                                selected : tab.item.key == focus.key,
                                onClick : onClick,
                                onClose : onClose,
                            })
                        }
                        </TabContainer>
                    </MouseDrag>);
                })
            }
            <SessionAddButton
                x={tabs.length * tabSize}
                onClick={() => onAdd()}
            />
        </Row>
    );
}

export default TabBar;
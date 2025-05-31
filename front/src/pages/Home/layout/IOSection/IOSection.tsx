import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { getEncoding, encodingForModel } from 'js-tiktoken';

import useLazyThrottle from '@/hooks/useLazyThrottle';
import useSignal from '@/hooks/useSignal';

import { useConfigStore, useSessionStore, useShortcutSignalStore, useSignalStore, useChannelStore } from '@/stores';
import SingleIOLayout from './SingleIOLayout';
import ChatIOLayout from './ChatIOLayout';


function IOSection() {
    const { font_size } = useConfigStore();
    const sessionState = useSessionStore();
    const color = useSessionStore(state=>state.color);
    const reloadInputSignal = useSignalStore(state=>state.reload_input);

    const [tokenCount, setTokenCount] = useState(0);
    const inputTextRef = useRef('');
    const [_, refresh] = useSignal();

    const tokenizer = useMemo(() => {
        return encodingForModel('chatgpt-4o-latest');
    }, []);

    // @TODO : 도중 세션 변경시 마지막 변경이 반영되지 않는 문제
    // 문제가 해결된다면 throttle을 debounce로 변경하는 것이 성능 상 좋음
    const updateInputTextThrottle = useLazyThrottle(() => {
        sessionState.update.input(inputTextRef.current);
    }, 100);

    const updateInputText = (text:string) => {
        inputTextRef.current = text;
        setTokenCount(tokenizer.encode(text).length);
        updateInputTextThrottle();
        refresh();
    }
    
    useLayoutEffect(() => {
        inputTextRef.current = sessionState.input;
        refresh();
    }, [sessionState.deps.last_session_id, reloadInputSignal]);

    useEffect(()=>{
        // signal 핸들링
        const unsubscribes = [
            useSignalStore.subscribe( // 요청 보내기 전 입력 업데이트
                (state)=>state.request,
                async ()=>{
                    const { instance } = useChannelStore.getState();
                    
                    await sessionState.update.input(inputTextRef.current);
                    await instance.request_ready.produce(1);
                }
            )
        ];
        return () => unsubscribes.forEach(unsub=>unsub());
    }, []);
    
    useEffect(()=>{
        // hotkey signal 핸들링
        const unsubscribes = [
            useShortcutSignalStore.subscribe(
                state=>state.send_request,
                ()=>sessionState.actions.request(),
            ),
            useShortcutSignalStore.subscribe(
                state=>state.copy_response,
                ()=>{
                    if (sessionState.output) {
                        try {
                            navigator.clipboard.writeText(sessionState.output);
                        }
                        catch (error) {
                            console.error('Failed to copy response:', error);
                        }
                    }
                }, 
            ),
        ];
        return ()=>unsubscribes.forEach(unsub=>unsub());
    }, []);

    
    if (1) {
        return (
            <ChatIOLayout
                inputText={inputTextRef.current}
                onChangeInputText={(value)=>updateInputText(value)}

                color={color}
                tokenCount={tokenCount}
            />
        );
    }
    else {
        return (
            <SingleIOLayout
                inputText={inputTextRef.current}
                onChangeInputText={(value)=>updateInputText(value)}
                
                color={color}
                tokenCount={tokenCount}
            />
        );
    }
}

export default IOSection;
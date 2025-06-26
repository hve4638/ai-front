import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { getEncoding, encodingForModel } from 'js-tiktoken';

import useLazyThrottle from '@/hooks/useLazyThrottle';
import useSignal from '@/hooks/useSignal';

import { useConfigStore, useSessionStore, useShortcutSignalStore, useSignalStore, useChannelStore, useProfileEvent, useProfileAPIStore } from '@/stores';
import SingleIOLayout from './SingleIOLayout';
import ChatIOLayout from './ChatIOLayout';

function IOSection() {
    const sessionState = useSessionStore();
    const color = useSessionStore(state=>state.color);
    const reloadInputSignal = useSignalStore(state=>state.reload_input);
    const { api } = useProfileAPIStore();

    const [inputLayoutType, setInputLayoutType] = useState<'normal'|'chat'>('normal');
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

    useEffect(()=>{
        setTokenCount(tokenizer.encode(inputTextRef.current).length);
        updateInputTextThrottle();
        refresh();
    }, [sessionState.deps.last_session_id])

    useEffect(()=>{
        api.rt(sessionState.rt_id).getMetadata()
            .then(({ input_type }) => {
                setInputLayoutType(input_type);
            });
    }, [api, sessionState.rt_id])

    useEffect(() => {
        if (sessionState.state === 'done') {
            sessionState.update.state('idle');
            useSignalStore.getState().signal.session_metadata();
        }
    }, [sessionState.deps.last_session_id, sessionState.state]);
    
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
            ),
        ];
        return () => unsubscribes.forEach(unsub=>unsub());
    }, []);
    
    useEffect(()=>{
        // hotkey signal 핸들링
        const unsubscribes = [
            useShortcutSignalStore.subscribe(
                state=>state.send_request,
                ()=>{
                    const { state } = useSessionStore.getState();

                    if (state === 'idle' || state === 'done') {
                        sessionState.actions.request();
                    }
                    else {
                        console.warn('request is ignored, because current state is', state);
                    }
                },
            ),
            useShortcutSignalStore.subscribe(
                state=>state.copy_response,
                ()=>{
                    const output = useSessionStore.getState().output;
                    if (output) {
                        try {
                            console.log('copying response to clipboard', output);
                            navigator.clipboard.writeText(output);
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

    
    if (inputLayoutType === 'chat') {
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
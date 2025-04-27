import InputField from 'components/InputField';
import { GoogleFontIcon, GoogleFontIconButton } from 'components/GoogleFontIcon';
import { useEffect, useLayoutEffect, useState } from 'react';
import useLazyThrottle from 'hooks/useLazyThrottle';
import { useCacheStore, useConfigStore, useSessionStore, useShortcutSignalStore, useSignalStore } from '@/stores';

import classNames from 'classnames';

function MainSection() {
    const configState = useConfigStore();
    const sessionState = useSessionStore();
    const color = useSessionStore(state=>state.color);
    const reloadInputSignal = useSignalStore(state=>state.reload_input);

    const [inputText, setInputText] = useState('');

    // @TODO : 도중 세션 변경시 마지막 변경이 반영되지 않는 문제
    // 문제가 해결된다면 throttle을 debounce로 변경하는 것이 성능 상 좋음
    const setInputTextThrottle = useLazyThrottle(() => {
        sessionState.update.input(inputText);
    }, 100);
    
    useLayoutEffect(() => {
        setInputText(sessionState.input);
    }, [sessionState.deps.last_session_id, reloadInputSignal]);
    
    useEffect(()=>{
        const unsubscribes = [
            useShortcutSignalStore.subscribe(
                state=>state.send_request,
                ()=>sessionState.actions.request(),
            ),
            useShortcutSignalStore.subscribe(
                state=>state.copy_response,
                ()=>{
                    if (sessionState.output) {
                        navigator.clipboard.writeText(sessionState.output);
                    }
                },
            ),
        ];

        return ()=>unsubscribes.forEach(unsubscribe=>unsubscribe());
    }, []);

    return (
        <>
            <div
                className={
                    classNames(
                        'row',
                        'flex',
                        'body',
                        `palette-${color}`
                    )}
                style={{
                    fontSize: `${configState.font_size}px`,
                }}
            >
                <InputField
                    className='flex'
                    style={{
                        margin: '8px 8px 16px 16px',
                        padding: '12px',
                    }}
                    text={inputText}
                    onChange={(text: string) => {
                        setInputText(text);
                        setInputTextThrottle();
                    }}
                >
                    <GoogleFontIcon
                        className='floating-button'
                        value='send'
                        style={{
                            cursor : 'pointer',
                            fontSize: '40px',
                            position: 'absolute',
                            right: '10px',
                            bottom: '10px',
                        }}
                        onClick={()=>{
                            sessionState.actions.request();
                        }}
                    />
                </InputField>
                <InputField
                    className='flex'
                    style={{
                        margin: '8px 16px 16px 8px',
                        padding: '12px',
                    }}
                    text={sessionState.output ?? ''}
                    onChange={()=>{}}
                    tabIndex={-1}
                />

            </div>
        </>
    )
}

export default MainSection;
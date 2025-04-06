import InputField from 'components/InputField';
import { GoogleFontIcon, GoogleFontIconButton } from 'components/GoogleFontIcon';
import { useEffect, useState } from 'react';
import useLazyThrottle from 'hooks/useLazyThrottle';
import { useCacheStore, useConfigStore, useSessionStore } from '@/stores';

function MainSection() {
    const configState = useConfigStore();
    const { last_session_id } = useCacheStore();
    const sessionState = useSessionStore();
    const [inputText, setInputText] = useState('');

    // @TODO : 도중 세션 변경시 마지막 변경이 반영되지 않는 문제
    // 문제가 해결된다면 throttle을 debounce로 변경하는 것이 성능 상 좋음
    const setInputTextThrottle = useLazyThrottle(() => {
        sessionState.update.input(inputText);
    }, 300);
    
    useEffect(() => {
        setInputText(sessionState.input);
    }, [last_session_id]);


    return (
        <>
            <div
                className='row flex'
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
                    />
                </InputField>
                <InputField
                    className='flex'
                    style={{
                        margin: '8px 16px 16px 8px',
                        padding: '12px',
                    }}
                    text={sessionState.output ?? ''}
                    onChange={sessionState.update.output}
                    readonly={true}
                />

            </div>
        </>
    )
}

export default MainSection;
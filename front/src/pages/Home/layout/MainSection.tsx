import InputField from 'components/InputField';
import { GoogleFontIcon } from 'components/GoogleFontIcon';
import { useEffect, useState } from 'react';
import { ProfileEventContext, useContextForce } from 'context';
import useLazyThrottle from 'hooks/useLazyThrottle';
import useDebounce from 'hooks/useDebounce';
import { useProfile, useProfileSession } from 'hooks/context';

function MainSection() {
    const {
        configs,
        shortcuts,
    } = useProfile();
    const {
        sessionId,
        input, setInput,
        output, setOutput,
    } = useProfileSession();
    const [inputText, setInputText] = useState('');

    // @TODO : 도중 세션 변경시 마지막 변경이 반영되지 않는 문제
    // 문제가 해결된다면 throttle을 debounce로 변경하는 것이 성능 상 좋음
    const setInputTextThrottle = useLazyThrottle(() => {
        setInput(inputText);
    }, 300);
    
    console.log ('MainSection sessionId : ', sessionId);
    useEffect(() => {
        console.log('input update : ', input);
        setInputText(input);
    }, [sessionId]);

    return (
        <>
            <div
                className='row flex'
                style={{
                    fontSize: `${configs.fontSize}px`,
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
                    text={output ?? ''}
                    onChange={setOutput}
                    readonly={true}
                />

            </div>
        </>
    )
}

export default MainSection;
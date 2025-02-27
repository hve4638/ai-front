import { RawProfileSessionContext } from 'context/RawProfileSessionContext';
import InputField from 'components/InputField';
import { GoogleFontIcon } from 'components/GoogleFontIcon';
import { useEffect, useState } from 'react';
import { ProfileEventContext, useContextForce } from 'context';
import useLazyThrottle from 'hooks/useLazyThrottle';
import useDebounce from 'hooks/useDebounce';

function MainSection() {
    const profileContext = useContextForce(ProfileEventContext);
    const {
        configs,
        shortcuts,
    } = profileContext;
    const rawProfileSessionContext = useContextForce(RawProfileSessionContext);
    const {
        profileSession,
        sessionId,
        lastInput, setLastInput,
        lastOutput, setLastOutput,
    } = rawProfileSessionContext;
    const [inputText, setInputText] = useState('');

    // @TODO : 도중 세션 변경시 마지막 변경이 반영되지 않는 문제
    // 문제가 해결된다면 throttle을 debounce로 변경하는 것이 성능 상 좋음
    const setInputTextThrottle = useLazyThrottle(() => {
        setLastInput(inputText);
    }, 300);

    useEffect(() => {
        setInputText(lastInput);
    }, [profileSession]);

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
                    text={lastOutput}
                    onChange={setLastOutput}
                    readonly={true}
                />

            </div>
        </>
    )
}

export default MainSection;
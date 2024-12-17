import { RawProfileContext, useContextForce } from 'context';
import Header from './Header';
import SessionBar from './components/SessionBar';
import InputField from 'components/InputField';
import { useState } from 'react';
import { GoogleFontIcon } from 'components/GoogleFontIcon';

function HomePage() {
    const [text, setText] = useState('');
    
    return (
        <div
            id='home'
            className='column'
        >
            <Header/>
            <div className='row flex'>
                <InputField
                    className='flex'
                    style={{
                        margin: '16px 8px 16px 16px',
                        padding: '12px',
                    }}
                    text={text}
                    onChange={setText}
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
                        margin: '16px 16px 16px 8px',
                        padding: '12px',
                    }}
                    text={text}
                    onChange={setText}
                    readonly={true}
                />

            </div>
            <SessionBar/>
        </div>
    );
}

export default HomePage;
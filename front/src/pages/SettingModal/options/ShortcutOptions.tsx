import { useState } from 'react';
import { CheckBoxForm, DropdownForm, HotkeyForm, NumberForm, StringForm, StringLongForm, ToggleSwitchForm } from 'components/Forms';
import { ProfileContext, useContextForce } from 'context';
import { Shortcut } from 'types/shortcut';

function ShortcutOptions() {
    const profileContext = useContextForce(ProfileContext);
    const {
        shortcuts,
    } = profileContext;
    const [enabledGlobalHotkey, setEnabledGlobalHotkey] = useState(true);

    const scToText = (shortcut:Shortcut) => {
        if (shortcut == null) return '-';
        if (shortcut.key) {
            let text = '';
            if (shortcut.ctrl) text += 'CTRL + ';
            if (shortcut.shift) text += 'SHIFT + ';
            if (shortcut.alt) text += 'ALT + ';
            text += shortcut.key.toUpperCase();
            return text;
        }
        else if (shortcut.wheel) {
            let text = '';
            if (shortcut.ctrl) text += 'CTRL + ';
            if (shortcut.shift) text += 'SHIFT + ';
            if (shortcut.alt) text += 'ALT + ';
            text += 'WHEEL ';
            if (shortcut.wheel < 0) text += 'UP';
            else if (shortcut.wheel > 0) text += 'DOWN';
            return text;
        }

        return '-';
    }

    return (
        <>
            <HotkeyForm
                name='폰트 크기 늘리기'
                text={scToText(shortcuts.fontSizeUp)}
                onClick={()=>{
                    ;
                }}
            />
            <HotkeyForm
                name='폰트 크기 줄이기'
                text={scToText(shortcuts.fontSizeDown)}
                onClick={()=>{
                    ;
                }}
            />
            <HotkeyForm
                name='요청 전송'
                text={scToText(shortcuts.sendRequest)}
                onClick={()=>{
                    ;
                }}
            />
            <HotkeyForm
                name='출력 복사'
                text={scToText(shortcuts.copyResponse)}
                onClick={()=>{
                    ;
                }}
            />
            <div style={{ height: '1em' }}/>
            <b style={{fontSize:'1.1em'}}>전역 단축키</b>
            <CheckBoxForm
                name='활성화'
                checked={enabledGlobalHotkey}
                onChange={setEnabledGlobalHotkey}
            />
            <HotkeyForm
                name='화면 활성화/비활성화'
                text='WHEEL UP'
                onClick={()=>{
                    ;
                }}
            />
            <HotkeyForm
                name='클립보드 입력에 복사'
                text='WHEEL UP'
                onClick={()=>{
                    ;
                }}
            />
        </>
    )
}

export default ShortcutOptions;
import { useEffect, useState } from 'react';
import { CheckBoxForm, DropdownForm, HotkeyForm, NumberForm, StringForm, StringLongForm, ToggleSwitchForm } from 'components/Forms';
import { ProfileContext, useContextForce } from 'context';
import ShortcutModal from './ShortcutModal';
import { shortcutToText } from 'utils/shortcut';
import { Shortcut } from 'types/shortcut';
import { Row } from 'components/layout';

function ShortcutOptions() {
    const profileContext = useContextForce(ProfileContext);
    const {
        shortcuts,
    } = profileContext;
    const [enabledGlobalHotkey, setEnabledGlobalHotkey] = useState(true);
    const [showShortcutModal, setShowShortcutModal] = useState(false);
    const [localSc, setLocalSc] = useState<[string, Shortcut][]>([]);

    useEffect(()=>{
        const list:[string, Shortcut][] = [
            ['폰트 크기 확대', shortcuts.fontSizeUp],
            ['폰트 크기 축소', shortcuts.fontSizeDown],
            ['요청 전송', shortcuts.sendRequest],
            ['출력 복사', shortcuts.copyResponse],
            ['다음 세션', shortcuts.nextTab],
            ['이전 세션', shortcuts.prevTab],
            ['세션 생성', shortcuts.createTab],
            ['세션 삭제', shortcuts.removeTab],
            ['삭제 삭제 취소', shortcuts.undoRemoveTab],
            ['세션 1 전환', shortcuts.tab1],
            ['세션 2 전환', shortcuts.tab2],
            ['세션 3 전환', shortcuts.tab3],
            ['세션 4 전환', shortcuts.tab4],
            ['세션 5 전환', shortcuts.tab5],
            ['세션 6 전환', shortcuts.tab6],
            ['세션 7 전환', shortcuts.tab7],
            ['세션 8 전환', shortcuts.tab8],
            ['세션 9 전환', shortcuts.tab9],
        ]
        setLocalSc(list);
    }, [shortcuts]);

    return (
        <>
            {
                localSc.map(([name, sc], index)=>(
                    <HotkeyForm
                        key={name}
                        name={name}
                        text={shortcutToText(sc)}
                        onClick={()=>{

                        }}
                    />
                ))
            }
            <div style={{ height: '1em' }}/>
            <b style={{fontSize:'1.1em'}}>전역 단축키</b>
            <CheckBoxForm
                name='활성화'
                checked={enabledGlobalHotkey}
                onChange={setEnabledGlobalHotkey}
            />
            <HotkeyForm
                name='화면 활성화/비활성화'
                text='-'
                onClick={()=>{
                    ;
                }}
            />
            <HotkeyForm
                name='클립보드 입력에 복사'
                text='-'
                onClick={()=>{
                    ;
                }}
            />
            {
                showShortcutModal &&
                <ShortcutModal
                    initValue={shortcuts.fontSizeUp}
                    name={'폰트 크기 확대'}
                    onChange={(shortcut)=>{
                        ;
                    }}
                    onClose={()=>{
                        ;
                    }}
                />
            }
        </>
    )
}

export default ShortcutOptions;
import { useLayoutEffect, useState } from 'react';
import { CheckBoxForm, HotkeyForm } from 'components/Forms';
import ShortcutModal from './ShortcutModal';
import { shortcutToText } from 'utils/shortcut';
import { Shortcut } from 'types/shortcut';
import useShortcutStore from '@/stores/useShortcutStore';
import { useModal } from '@/hooks/useModal';

function ShortcutOptions() {
    const modal = useModal();
    const shortcuts = useShortcutStore();

    const [enabledGlobalHotkey, setEnabledGlobalHotkey] = useState(true);
    const [showShortcutModal, setShowShortcutModal] = useState(false);
    const [localSc, setLocalSc] = useState<[string, Shortcut, (sc:Shortcut)=>void][]>([]);

    useLayoutEffect(()=>{
        const list:[string, Shortcut, (sc:Shortcut)=>void][] = [
            ['폰트 크기 확대', shortcuts.font_size_up, (next)=>shortcuts.update.font_size_up(next)],
            ['폰트 크기 축소', shortcuts.font_size_down, (next)=>shortcuts.update.font_size_down(next)],
            ['요청 전송', shortcuts.send_request, (shortcut)=>shortcuts.update.send_request(shortcut)],
            ['출력 복사', shortcuts.copy_response, (shortcut)=>shortcuts.update.copy_response(shortcut)],
            ['다음 세션', shortcuts.next_tab, (shortcut)=>shortcuts.update.next_tab(shortcut)],
            ['이전 세션', shortcuts.prev_tab, (shortcut)=>shortcuts.update.prev_tab(shortcut)],
            ['세션 생성', shortcuts.create_tab, (shortcut)=>shortcuts.update.create_tab(shortcut)],
            ['세션 삭제', shortcuts.remove_tab, (shortcut)=>shortcuts.update.remove_tab(shortcut)],
            ['삭제 삭제 취소', shortcuts.undo_remove_tab, (shortcut)=>shortcuts.update.undo_remove_tab(shortcut)],
            ['세션 1 전환', shortcuts.tab1, (shortcut)=>shortcuts.update.tab1(shortcut)],
            ['세션 2 전환', shortcuts.tab2, (shortcut)=>shortcuts.update.tab2(shortcut)],
            ['세션 3 전환', shortcuts.tab3, (shortcut)=>shortcuts.update.tab3(shortcut)],
            ['세션 4 전환', shortcuts.tab4, (shortcut)=>shortcuts.update.tab4(shortcut)],
            ['세션 5 전환', shortcuts.tab5, (shortcut)=>shortcuts.update.tab5(shortcut)],
            ['세션 6 전환', shortcuts.tab6, (shortcut)=>shortcuts.update.tab6(shortcut)],
            ['세션 7 전환', shortcuts.tab7, (shortcut)=>shortcuts.update.tab7(shortcut)],
            ['세션 8 전환', shortcuts.tab8, (shortcut)=>shortcuts.update.tab8(shortcut)],
            ['세션 9 전환', shortcuts.tab9, (shortcut)=>shortcuts.update.tab9(shortcut)],
        ]
        setLocalSc(list);
    }, [shortcuts]);

    return (
        <>
            {
                localSc.map(([name, sc, updateSC], index)=>(
                    <HotkeyForm
                        key={name}
                        name={name}
                        text={shortcutToText(sc)}
                        onClick={()=>{
                            console.log('CLICK?');
                            modal.open(
                                ShortcutModal,
                                {
                                    initValue: sc,
                                    name : name,
                                    onChange: (shortcut:Shortcut)=>{
                                        updateSC(shortcut);
                                    }
                                }
                            )
                        }}
                    />
                ))
            }
            <div style={{ height: '1em' }}/>
            <h2 className='undraggable'>전역 단축키</h2>
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
                    initValue={shortcuts.font_size_up}
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
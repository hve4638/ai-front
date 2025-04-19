import { useLayoutEffect, useState } from 'react';
import { CheckBoxForm, HotkeyForm } from 'components/Forms';
import ShortcutModal from './ShortcutModal';
import { shortcutToText } from 'utils/shortcut';
import { Shortcut } from 'types/shortcut';
import useShortcutStore from '@/stores/useShortcutStore';
import { useModal } from '@/hooks/useModal';
import { useTranslation } from 'react-i18next';

function ShortcutOptions() {
    const { t } = useTranslation();
    const modal = useModal();
    const shortcuts = useShortcutStore();

    const [enabledGlobalHotkey, setEnabledGlobalHotkey] = useState(true);
    const [localSc, setLocalSc] = useState<[string, Shortcut, (sc:Shortcut)=>void][]>([]);

    useLayoutEffect(()=>{
        const list:[string, Shortcut, (sc:Shortcut)=>void][] = [
            [t('shortcut.font_size_up'), shortcuts.font_size_up, (next)=>shortcuts.update.font_size_up(next)],
            [t('shortcut.font_size_down'), shortcuts.font_size_down, (next)=>shortcuts.update.font_size_down(next)],
            [t('shortcut.send_request'), shortcuts.send_request, (shortcut)=>shortcuts.update.send_request(shortcut)],
            [t('shortcut.copy_response'), shortcuts.copy_response, (shortcut)=>shortcuts.update.copy_response(shortcut)],
            [t('shortcut.next_tab'), shortcuts.next_tab, (shortcut)=>shortcuts.update.next_tab(shortcut)],
            [t('shortcut.prev_tab'), shortcuts.prev_tab, (shortcut)=>shortcuts.update.prev_tab(shortcut)],
            [t('shortcut.create_tab'), shortcuts.create_tab, (shortcut)=>shortcuts.update.create_tab(shortcut)],
            [t('shortcut.remove_tab'), shortcuts.remove_tab, (shortcut)=>shortcuts.update.remove_tab(shortcut)],
            [t('shortcut.undo_remove_tab'), shortcuts.undo_remove_tab, (shortcut)=>shortcuts.update.undo_remove_tab(shortcut)],
            [t('shortcut.tab1'), shortcuts.tab1, (shortcut)=>shortcuts.update.tab1(shortcut)],
            [t('shortcut.tab2'), shortcuts.tab2, (shortcut)=>shortcuts.update.tab2(shortcut)],
            [t('shortcut.tab3'), shortcuts.tab3, (shortcut)=>shortcuts.update.tab3(shortcut)],
            [t('shortcut.tab4'), shortcuts.tab4, (shortcut)=>shortcuts.update.tab4(shortcut)],
            [t('shortcut.tab5'), shortcuts.tab5, (shortcut)=>shortcuts.update.tab5(shortcut)],
            [t('shortcut.tab6'), shortcuts.tab6, (shortcut)=>shortcuts.update.tab6(shortcut)],
            [t('shortcut.tab7'), shortcuts.tab7, (shortcut)=>shortcuts.update.tab7(shortcut)],
            [t('shortcut.tab8'), shortcuts.tab8, (shortcut)=>shortcuts.update.tab8(shortcut)],
            [t('shortcut.tab9'), shortcuts.tab9, (shortcut)=>shortcuts.update.tab9(shortcut)],
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
                name={t('shortcut.toggle_screen')}
                text='-'
                onClick={()=>{
                    ;
                }}
            />
            <HotkeyForm
                name={t('shortcut.paste_clipboard_into_input')}
                text='-'
                onClick={()=>{
                    ;
                }}
            />
        </>
    )
}

export default ShortcutOptions;
import { useState } from 'react';
import { CheckBoxForm, DropdownForm, NumberForm, StringForm, StringLongForm, ToggleSwitchForm } from 'components/Forms';
import { LayoutModes, ThemeModes } from 'types/profile';
import { useConfigStore } from '@/stores';

function GeneralOptions() {
    const config = useConfigStore();

    return (
        <>
            <NumberForm
                name='폰트 크기'
                width='4em'
                value={config.font_size}
                onChange={config.update.font_size}
            />
            <DropdownForm
                name='레이아웃 설정'
                items={
                    [
                        { name: '자동', key: LayoutModes.AUTO },
                        { name: '가로', key: LayoutModes.VERTICAL },
                        { name: '세로', key: LayoutModes.HORIZONTAL },
                    ]
                }
                value={config.layout_mode}
                onChange={(item)=>{
                    config.update.layout_mode(item.key as LayoutModes);
                }}
                onItemNotFound={()=>{
                    config.update.layout_mode(LayoutModes.AUTO);
                }}
            />
            <DropdownForm
                name='화면 테마'
                items={
                    [
                        { name: '시스템 설정', key: ThemeModes.SYSTEM_DEFAULT },
                        { name: '밝은 테마', key: ThemeModes.LIGHT },
                        { name: '어두운 테마', key: ThemeModes.DARK },
                    ]
                }
                value={config.theme_mode}
                onChange={(item)=>{
                    config.update.theme_mode(item.key as ThemeModes);
                }}
                onItemNotFound={()=>{
                    config.update.theme_mode(ThemeModes.SYSTEM_DEFAULT);
                }}
            />
            <CheckBoxForm
                name='탭 삭제 시 확인 메시지 표시'
                checked={config.confirm_on_session_close}
                onChange={config.update.confirm_on_session_close}
            />
            <NumberForm
                name='삭제된 세션 최대 기억 수'
                width='4em'
                value={config.remember_deleted_session_count}
                onChange={config.update.remember_deleted_session_count}
            />
            
            
        </>
    )
}

export default GeneralOptions;
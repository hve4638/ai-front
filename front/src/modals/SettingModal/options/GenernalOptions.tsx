import { useState } from 'react';
import { CheckBoxForm, DropdownForm, NumberForm, StringForm, StringLongForm, ToggleSwitchForm } from 'components/Forms';
import { ProfileEventContext, useContextForce } from 'context';
import { LayoutModes, ThemeModes } from 'types/profile';

function GeneralOptions() {
    const profileContext = useContextForce(ProfileEventContext);
    const {
        configs,
    } = profileContext;

    return (
        <>
            <NumberForm
                name='폰트 크기'
                width='4em'
                value={configs.fontSize}
                onChange={configs.setFontSize}
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
                value={configs.layoutMode}
                onChange={(item)=>{
                    configs.setLayoutMode(item.key as LayoutModes);
                }}
                onItemNotFound={()=>{
                    configs.setLayoutMode(LayoutModes.AUTO);
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
                value={configs.themeMode}
                onChange={(item)=>{
                    configs.setThemeMode(item.key as ThemeModes);
                }}
                onItemNotFound={()=>{
                    configs.setThemeMode(ThemeModes.SYSTEM_DEFAULT);
                }}
            />
            {/* <ToggleSwitchForm
                name='프리셋 고정 해제 시 확인 메시지 표시'
            /> */}
            <CheckBoxForm
                name='탭 삭제 시 확인 메시지 표시'
                checked={configs.confirmOnSessionClose}
                onChange={configs.setConfirmOnSessionClose}
            />
            <NumberForm
                name='삭제된 세션 최대 기억 수'
                width='4em'
                value={configs.rememberDeletedSessionCount}
                onChange={configs.setRememberDeletedSessionCount}
            />
            
            
        </>
    )
}

export default GeneralOptions;
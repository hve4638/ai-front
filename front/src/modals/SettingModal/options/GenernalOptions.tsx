import { useMemo, useState } from 'react';

import { LayoutModes, ThemeModes } from '@/types/profile';
import { useConfigStore } from '@/stores';

import SliderForm from '@/components/Forms/SliderForm';
import { Column } from '@/components/layout';
import { CheckBoxForm, DropdownForm, NumberForm } from '@/components/Forms';

import { remapDecimal } from '@/utils/math';
import styles from '../styles.module.scss';
import Delimiter from '@/components/Delimiter';

function GeneralOptions() {
    const config = useConfigStore();
    const ioRatio = useMemo(() => {
        const left = config.textarea_io_ratio[0];
        const right = config.textarea_io_ratio[1];
        const total = left + right;

        return [
            Math.round((left / total) * 100),
            Math.round((right / total) * 100)
        ];
    }, [config.textarea_io_ratio[0], config.textarea_io_ratio[1]]);

    return (
        <Column className={styles['options-gap']}>
            <b style={{ fontSize: '0.975em' }}>기본</b>
            <Delimiter/>
            <NumberForm
                name='폰트 크기'
                width='4em'
                value={config.font_size}
                onChange={config.update.font_size}
            />
            {/* <DropdownForm
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
            /> */}
            <DropdownForm
                name='레이아웃 설정'
                items={
                    [
                        { name: '가로', key: LayoutModes.HORIZONTAL },
                        { name: '세로', key: LayoutModes.VERTICAL },
                    ]
                }
                value={config.layout_mode}
                onChange={(item)=>{
                    config.update.layout_mode(item.key as LayoutModes);
                }}
                onItemNotFound={()=>{
                    config.update.layout_mode(LayoutModes.HORIZONTAL);
                }}
            />


            <b style={{ fontSize: '0.975em', marginTop: '1em' }}>입력창</b>
            <Delimiter/>
            <SliderForm
                name='입력창 여백'
                min={4}
                max={24}
                value={config.textarea_padding}
                onChange={(value)=>{
                    const radius = remapDecimal(value, {min: 4, max: 16}, {min: 1, max: 5});
                    config.update.textarea_padding(value);
                }}
                marks={{
                    '4' : '4',
                    '8' : '8',
                    '12' : '12',
                    '16' : '16',
                    '20' : '20',
                    '24' : '24',
                }}
            />
            <div style={{ height : '0.125em' }}/>
            <SliderForm
                name='입력창 비율'
                min={20}
                max={80}
                value={ioRatio[0]}
                onChange={(value)=>{
                    config.update.textarea_io_ratio([value, 100-value]);
                }}
                marks={{
                    '20' : '20%',
                    '30' : '30%',
                    '40' : '40%',
                    '50' : '50%',
                    '60' : '60%',
                    '70' : '70%',
                    '80' : '80%',
                }}
            />
            <div style={{height: '0.25em'}}/>
            {/* <CheckBoxForm
                name='탭 삭제 시 확인 메시지 표시'
                checked={config.confirm_on_session_close}
                onChange={config.update.confirm_on_session_close}
            />
            <NumberForm
                name='삭제된 세션 최대 기억 수'
                width='4em'
                value={config.remember_deleted_session_count}
                onChange={config.update.remember_deleted_session_count}
            /> */}
            <b style={{ fontSize: '0.975em', marginTop: '1em' }}>전송</b>
            <Delimiter/>
            <CheckBoxForm
                name='요청 후 입력 지우기 (기본 레이아웃)'
                checked={config.clear_on_submit_normal}
                onChange={config.update.clear_on_submit_normal}
            />
            <CheckBoxForm
                name='요청 후 입력 지우기 (채팅 레이아웃)'
                checked={config.clear_on_submit_chat}
                onChange={config.update.clear_on_submit_chat}
            />
        </Column>
    )
}

export default GeneralOptions;
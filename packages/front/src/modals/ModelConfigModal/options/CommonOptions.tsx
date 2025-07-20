import Delimiter from '@/components/Delimiter';
import { CheckBoxForm, NumberForm } from '@/components/Forms';
import SafetyFilterSlider from './SafetyFilterSlider';
import { OptionsProps } from './types';

function CommonOptions({
    config,
    refresh,
}: OptionsProps) {
    const disabled = !config.override_enabled || !config.override_common;

    return (
        <>
            <CheckBoxForm
                style={{ marginBottom: '0.25em' }}
                label={<b>공통 설정 덮어쓰기</b>}
                checked={config.override_common ?? false}
                onChange={(next) => {
                    config.override_common = next;
                    refresh();
                }}

                disabled={!config.override_enabled}
            />
            <Delimiter />
            <NumberForm
                name='최대 응답 크기'
                value={config.max_tokens}
                onChange={(next) => {
                    config.max_tokens = next ?? undefined;
                    refresh();
                }}

                allowDecimal={false}
                allowEmpty={true}
                instantChange={true}
                disabled={disabled}
            />
            <NumberForm
                name='온도'
                value={config.temperature}
                onChange={(next) => {
                    config.temperature = next ?? undefined;
                    refresh();
                }}
                allowDecimal={true}
                allowEmpty={true}
                instantChange={true}
                disabled={disabled}
            />
            <NumberForm
                name='Top P'
                value={config.top_p}
                onChange={(next) => {
                    config.top_p = next ?? undefined;
                    refresh();
                }}
                allowDecimal={true}
                allowEmpty={true}
                instantChange={true}
                disabled={disabled}
            />
        </>
    )
}

export default CommonOptions;
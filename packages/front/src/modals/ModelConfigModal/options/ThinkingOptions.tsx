import Delimiter from '@/components/Delimiter';
import { CheckBoxForm, NumberForm } from '@/components/Forms';
import SafetyFilterSlider from './SafetyFilterSlider';
import { OptionsProps } from './types';

function ThinkingOptions({
    config,
    refresh,
}: OptionsProps) {
    const disabled = !config.override_enabled || !config.override_thinking;
    const safetySettings = config?.safety_settings ?? {};

    return (
        <>
            <CheckBoxForm
                style={{ marginBottom: '0.25em' }}
                label={<b>추론 설정 덮어쓰기</b>}
                checked={config.override_thinking ?? false}
                onChange={(next) => {
                    config.override_thinking = next;
                    refresh();
                }}
                disabled={!config.override_enabled}
            />
            <Delimiter />
            <CheckBoxForm
                name='추론 활성화'
                checked={config.use_thinking ?? false}
                onChange={(next) => {
                    config.use_thinking = next ?? undefined;
                    refresh();
                }}
                disabled={disabled}
            />
            <NumberForm
                name='추론 토큰 크기'
                value={config.thinking_tokens}
                onChange={(next) => {
                    config.thinking_tokens = next ?? undefined;
                    refresh();
                }}
                allowDecimal={false}
                disabled={disabled}
            />
            <CheckBoxForm
                name='추론 요약 제공'
                checked={config.thinking_summary ?? false}
                onChange={(next) => {
                    config.thinking_summary = next ?? undefined;
                    refresh();
                }}
                disabled={disabled}
            />
        </>
    )
}

export default ThinkingOptions
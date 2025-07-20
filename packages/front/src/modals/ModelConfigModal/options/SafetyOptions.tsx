import Delimiter from '@/components/Delimiter';
import { CheckBoxForm } from '@/components/Forms';
import SafetyFilterSlider from './SafetyFilterSlider';
import { OptionsProps } from './types';

function ThinkingOptions({
    config,
    refresh,
}: OptionsProps) {
    const disabled = !config.override_enabled || !config.override_safety_settings;
    const safetySettings = config?.safety_settings ?? {};

    return (
        <>
            <CheckBoxForm
                style={{ marginBottom: '0.25em' }}
                label={<b>안전 필터 덮어쓰기</b>}
                checked={config.override_safety_settings ?? false}
                onChange={(next) => {
                    config.override_safety_settings = next;
                    refresh();
                }}
                disabled={!config.override_enabled}
            />
            <Delimiter />
            <SafetyFilterSlider
                // HARASSMENT
                name='괴롭힘'
                value={safetySettings.HARM_CATEGORY_HARASSMENT ?? 'OFF'}
                onChange={(next) => {
                    config.safety_settings ??= {};
                    config.safety_settings.HARM_CATEGORY_HARASSMENT = next as GeminiSafetyThreshold;
                    refresh();
                }}
                disabled={disabled}
            />
            <SafetyFilterSlider
                // HATE_SPEECH
                name='증오심 표현'
                value={safetySettings.HARM_CATEGORY_HATE_SPEECH ?? 'OFF'}
                onChange={(next) => {
                    config.safety_settings ??= {};
                    config.safety_settings.HARM_CATEGORY_HATE_SPEECH = next as GeminiSafetyThreshold;
                    refresh();
                }}
                disabled={disabled}
            />
            <SafetyFilterSlider
                // name='SEXUALLY_EXPLICIT'
                name='음란물'
                value={safetySettings.HARM_CATEGORY_SEXUALLY_EXPLICIT ?? 'OFF'}
                onChange={(next) => {
                    config.safety_settings ??= {};
                    config.safety_settings.HARM_CATEGORY_SEXUALLY_EXPLICIT = next as GeminiSafetyThreshold;
                    refresh();
                }}
                disabled={disabled}
            />
            <SafetyFilterSlider
                // name='DANGEROUS_CONTENT'
                name='위험한 콘텐츠'
                value={safetySettings.HARM_CATEGORY_DANGEROUS_CONTENT ?? 'OFF'}
                onChange={(next) => {
                    config.safety_settings ??= {};
                    config.safety_settings.HARM_CATEGORY_DANGEROUS_CONTENT = next as GeminiSafetyThreshold;
                    refresh();
                }}
                disabled={disabled}
            />
            <SafetyFilterSlider
                // name='CIVIC_INTEGRITY'
                name='시민의식'
                value={safetySettings.HARM_CATEGORY_CIVIC_INTEGRITY ?? 'OFF'}
                onChange={(next) => {
                    config.safety_settings ??= {};
                    config.safety_settings.HARM_CATEGORY_CIVIC_INTEGRITY = next as GeminiSafetyThreshold;
                    refresh();
                }}
                disabled={disabled}
            />
        </>
    )
}

export default ThinkingOptions